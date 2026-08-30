// Direct-to-GitHub publishing for the flash editor.
//
// The site is a static GitHub Pages build with no backend, so a real OAuth
// login is impossible (the token exchange needs a server + client secret and
// has no CORS). Instead the artist pastes a fine-grained personal access
// token once; it lives only in this browser's localStorage and is used to
// push a single commit through the Git Data API.

const OWNER = "joaorb64";
const REPO = "fufutattoo";
const BRANCH = "main";
const FLASHES_DIR = "public/flashes";

const TOKEN_KEY = "flashEditor.githubToken";

export const CREATE_TOKEN_URL =
  "https://github.com/settings/personal-access-tokens/new";
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
        `Token recusado pelo GitHub (${res.status}). Verifique se ele tem ` +
          `permissão de "Contents: Read and write" no repositório ${REPO_SLUG}.`,
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
          `O token funciona mas não tem permissão de escrita em ${REPO_SLUG}. ` +
          `Recrie-o com "Contents: Read and write".`,
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

  onProgress("Lendo o estado atual do repositório…");
  const ref = await gh(token, `/repos/${REPO_SLUG}/git/ref/heads/${BRANCH}`);
  const baseCommitSha: string = ref.object.sha;
  const baseCommit = await gh(
    token,
    `/repos/${REPO_SLUG}/git/commits/${baseCommitSha}`,
  );
  const baseTreeSha: string = baseCommit.tree.sha;

  const tree: Record<string, unknown>[] = [];

  onProgress("Enviando data.yaml…");
  const yamlBlob = await gh(token, `/repos/${REPO_SLUG}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({
      content: utf8ToBase64(yamlText),
      encoding: "base64",
    }),
  });
  tree.push({
    path: `${dir}/data.yaml`,
    mode: "100644",
    type: "blob",
    sha: yamlBlob.sha,
  });

  let i = 0;
  for (const img of images) {
    i += 1;
    onProgress(`Enviando imagem ${i}/${images.length}…`);
    const blob = await gh(token, `/repos/${REPO_SLUG}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: await blobToBase64(img.blob),
        encoding: "base64",
      }),
    });
    tree.push({
      path: `${dir}/${img.name}`,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  for (const path of removePaths) {
    tree.push({ path, mode: "100644", type: "blob", sha: null });
  }

  onProgress("Criando o commit…");
  const newTree = await gh(token, `/repos/${REPO_SLUG}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
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

  return {
    commitUrl: `https://github.com/${REPO_SLUG}/commit/${commit.sha}`,
  };
}
