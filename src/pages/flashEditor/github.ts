// Direct-to-GitHub publishing for the flash editor.
//
// The site is a static GitHub Pages build with no backend, so a real OAuth
// login is impossible (the token exchange needs a server + client secret and
// has no CORS). Instead the user pastes a personal access token once; it
// lives only in this browser's localStorage and is used to push a single
// commit through the Git Data API.
//
// A *classic* PAT with the `repo` scope is used rather than a fine-grained
// one: fine-grained tokens can't target a repository owned by another
// personal account, so a collaborator (e.g. Flavia) couldn't make one for
// this repo without moving it into an organisation.

const OWNER = "joaorb64";
const REPO = "fufutattoo";
const BRANCH = "main";
const FLASHES_DIR = "public/flashes";

const TOKEN_KEY = "flashEditor.githubToken";

export const CREATE_TOKEN_URL =
  "https://github.com/settings/tokens/new?scopes=repo&description=fufutattoo+flash+editor";
export const REPO_SLUG = `${OWNER}/${REPO}`;

export function getStoredToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setStoredToken(token: string) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Private mode / storage disabled — the token just won't persist.
  }
}

async function gh(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.message || "";
    } catch {
      // no JSON body
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `Token recusado pelo GitHub (${res.status}). Confirme que ele tem o ` +
          `escopo "repo" e que a sua conta tem acesso de escrita a ${REPO_SLUG}.`,
      );
    }
    throw new Error(`GitHub ${res.status}: ${detail || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function verifyToken(
  token: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const repo = await gh(token, `/repos/${REPO_SLUG}`);
    if (!repo?.permissions?.push) {
      return {
        ok: false,
        error:
          `O token funciona mas a conta não tem permissão de escrita em ${REPO_SLUG}. ` +
          `Confirme que está como colaboradora do repositório e que o token tem o escopo "repo".`,
      };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

/** `/flashes/foo/1.png` (as stored in flashes.json) -> `public/flashes/foo/1.png` */
export function repoPathFromImageUrl(url: string): string | null {
  const m = url.match(/\/flashes\/([^/]+)\/(.+)$/);
  return m ? `${FLASHES_DIR}/${m[1]}/${m[2]}` : null;
}

type TreeEntry = { path: string; mode: "100644"; type: "blob"; sha: string | null };

// Push one commit built from an explicit list of tree entries (a null `sha`
// deletes that path) on top of the current branch head.
async function pushCommit(
  token: string,
  message: string,
  tree: TreeEntry[],
  onProgress: (msg: string) => void,
): Promise<{ commitUrl: string }> {
  onProgress("Lendo o estado atual do repositório…");
  const ref = await gh(token, `/repos/${REPO_SLUG}/git/ref/heads/${BRANCH}`);
  const baseCommitSha: string = ref.object.sha;
  const baseCommit = await gh(
    token,
    `/repos/${REPO_SLUG}/git/commits/${baseCommitSha}`,
  );

  onProgress("Criando o commit…");
  const newTree = await gh(token, `/repos/${REPO_SLUG}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }),
  });
  const commit = await gh(token, `/repos/${REPO_SLUG}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });
  await gh(token, `/repos/${REPO_SLUG}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });

  return { commitUrl: `https://github.com/${REPO_SLUG}/commit/${commit.sha}` };
}

async function uploadBlob(token: string, content: string): Promise<string> {
  const blob = await gh(token, `/repos/${REPO_SLUG}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content, encoding: "base64" }),
  });
  return blob.sha;
}

export type CommitFileInput = {
  token: string;
  slug: string;
  yamlText: string;
  images: { blob: Blob; name: string }[]; // name like "1.png"
  message: string;
  removePaths?: string[]; // full repo paths of stale files to delete
  onProgress?: (msg: string) => void;
};

export async function commitFlash({
  token,
  slug,
  yamlText,
  images,
  message,
  removePaths = [],
  onProgress = () => {},
}: CommitFileInput): Promise<{ commitUrl: string }> {
  const dir = `${FLASHES_DIR}/${slug}`;
  const tree: TreeEntry[] = [];

  onProgress("Enviando data.yaml…");
  tree.push({
    path: `${dir}/data.yaml`,
    mode: "100644",
    type: "blob",
    sha: await uploadBlob(token, utf8ToBase64(yamlText)),
  });

  let i = 0;
  for (const img of images) {
    i += 1;
    onProgress(`Enviando imagem ${i}/${images.length}…`);
    tree.push({
      path: `${dir}/${img.name}`,
      mode: "100644",
      type: "blob",
      sha: await uploadBlob(token, await blobToBase64(img.blob)),
    });
  }

  for (const path of removePaths) {
    tree.push({ path, mode: "100644", type: "blob", sha: null });
  }

  return pushCommit(token, message, tree, onProgress);
}

export type DeleteFlashInput = {
  token: string;
  slug: string;
  filePaths: string[]; // full repo paths of every file in the flash's folder
  message: string;
  onProgress?: (msg: string) => void;
};

export async function deleteFlash({
  token,
  slug,
  filePaths,
  message,
  onProgress = () => {},
}: DeleteFlashInput): Promise<{ commitUrl: string }> {
  const paths = new Set([`${FLASHES_DIR}/${slug}/data.yaml`, ...filePaths]);
  const tree: TreeEntry[] = [...paths].map((path) => ({
    path,
    mode: "100644",
    type: "blob",
    sha: null,
  }));
  return pushCommit(token, message, tree, onProgress);
}

export const TAGS_DICT_PATH = `${FLASHES_DIR}/tags.yaml`;

// Commit a single UTF-8 text file (used for the shared tag dictionary).
export async function commitTextFile({
  token,
  path,
  text,
  message,
  onProgress = () => {},
}: {
  token: string;
  path: string;
  text: string;
  message: string;
  onProgress?: (msg: string) => void;
}): Promise<{ commitUrl: string }> {
  onProgress("A enviar o ficheiro…");
  const tree: TreeEntry[] = [
    {
      path,
      mode: "100644",
      type: "blob",
      sha: await uploadBlob(token, utf8ToBase64(text)),
    },
  ];
  return pushCommit(token, message, tree, onProgress);
}
