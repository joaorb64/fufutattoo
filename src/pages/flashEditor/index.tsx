import { useEffect, useMemo, useState } from "react";
import yaml from "js-yaml";
import JSZip from "jszip";
import Fuse from "fuse.js";
import {
  CREATE_TOKEN_URL,
  REPO_SLUG,
  commitFlash,
  deleteFlash,
  getStoredToken,
  repoPathFromImageUrl,
  setStoredToken,
  verifyToken,
} from "./github";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

type ImageEntry = { file: File; url: string };

const emptyForm = {
  name: "",
  slug: "",
  slugTouched: false,
  description: "",
  price: "",
  sizeMinW: "",
  sizeMinH: "",
  sizeMaxW: "",
  sizeMaxH: "",
  tags: [] as string[],
  nameEnOverride: "",
  nameEsOverride: "",
  descEnOverride: "",
  descEsOverride: "",
};

export default function FlashEditor() {
  const [allFlashes, setAllFlashes] = useState<Record<string, any>>({});
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [loadedFlash, setLoadedFlash] = useState<any | null>(null);

  const [name, setName] = useState(emptyForm.name);
  const [slug, setSlug] = useState(emptyForm.slug);
  const [slugTouched, setSlugTouched] = useState(emptyForm.slugTouched);
  const [description, setDescription] = useState(emptyForm.description);
  const [price, setPrice] = useState(emptyForm.price);
  const [sizeMinW, setSizeMinW] = useState(emptyForm.sizeMinW);
  const [sizeMinH, setSizeMinH] = useState(emptyForm.sizeMinH);
  const [sizeMaxW, setSizeMaxW] = useState(emptyForm.sizeMaxW);
  const [sizeMaxH, setSizeMaxH] = useState(emptyForm.sizeMaxH);
  const [tags, setTags] = useState<string[]>(emptyForm.tags);
  const [tagInput, setTagInput] = useState("");
  const [nameEnOverride, setNameEnOverride] = useState(emptyForm.nameEnOverride);
  const [nameEsOverride, setNameEsOverride] = useState(emptyForm.nameEsOverride);
  const [descEnOverride, setDescEnOverride] = useState(emptyForm.descEnOverride);
  const [descEsOverride, setDescEsOverride] = useState(emptyForm.descEsOverride);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const [token, setToken] = useState(getStoredToken);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenState, setTokenState] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >(getStoredToken() ? "valid" : "idle");
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "done" | "error"
  >("idle");
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [commitUrl, setCommitUrl] = useState<string | null>(null);
  const [deleteState, setDeleteState] = useState<
    "idle" | "confirm" | "deleting" | "done"
  >("idle");

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}flashes.json`)
      .then((res) => res.json())
      .then((data) => setAllFlashes(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(allFlashes).forEach((flash: any) => {
      flash.tags?.forEach((tag: Record<string, string>) => {
        if (tag.pt) counts[tag.pt] = (counts[tag.pt] || 0) + 1;
      });
    });
    return counts;
  }, [allFlashes]);

  const tagFuse = useMemo(
    () => new Fuse(Object.keys(tagCounts), { threshold: 0.4, ignoreLocation: true }),
    [tagCounts],
  );

  const tagSuggestions = useMemo(() => {
    const q = tagInput.trim();
    if (!q) return [];
    return tagFuse
      .search(q)
      .map((r) => r.item)
      .filter((t) => !tags.includes(t))
      .sort((a, b) => tagCounts[b] - tagCounts[a])
      .slice(0, 8);
  }, [tagInput, tagFuse, tagCounts, tags]);

  const slugConflict = useMemo(
    () => !!slug && Object.keys(allFlashes).some((k) => k === slug && k !== originalSlug),
    [slug, allFlashes, originalSlug],
  );

  const nameConflictSlug = useMemo(() => {
    const n = name.trim().toLowerCase();
    if (!n) return null;
    const match = Object.entries(allFlashes).find(
      ([k, f]: [string, any]) =>
        (f.name?.pt || "").trim().toLowerCase() === n && k !== originalSlug,
    );
    return match ? match[0] : null;
  }, [name, allFlashes, originalSlug]);

  const addTag = (raw: string) => {
    const clean = raw.trim().toLowerCase();
    if (clean && !tags.includes(clean)) setTags((prev) => [...prev, clean]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const entries = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...entries]);
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const resetForm = () => {
    setOriginalSlug(null);
    setLoadedFlash(null);
    setName(emptyForm.name);
    setSlug(emptyForm.slug);
    setSlugTouched(emptyForm.slugTouched);
    setDescription(emptyForm.description);
    setPrice(emptyForm.price);
    setSizeMinW(emptyForm.sizeMinW);
    setSizeMinH(emptyForm.sizeMinH);
    setSizeMaxW(emptyForm.sizeMaxW);
    setSizeMaxH(emptyForm.sizeMaxH);
    setTags(emptyForm.tags);
    setNameEnOverride(emptyForm.nameEnOverride);
    setNameEsOverride(emptyForm.nameEsOverride);
    setDescEnOverride(emptyForm.descEnOverride);
    setDescEsOverride(emptyForm.descEsOverride);
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setDownloaded(false);
  };

  const loadExisting = async (existingSlug: string) => {
    setDeleteState("idle");
    setUploadState("idle");
    if (!existingSlug) {
      resetForm();
      return;
    }
    const flash = allFlashes[existingSlug];
    if (!flash) return;

    setDownloaded(false);
    setOriginalSlug(existingSlug);
    setLoadedFlash(flash);
    setSlug(existingSlug);
    setSlugTouched(true);
    setName(flash.name?.pt || "");
    setDescription(flash.description?.pt || "");
    setPrice(flash.price != null ? String(flash.price) : "");
    setSizeMinW(flash.size_min?.[0] != null ? String(flash.size_min[0]) : "");
    setSizeMinH(flash.size_min?.[1] != null ? String(flash.size_min[1]) : "");
    setSizeMaxW(flash.size_max?.[0] != null ? String(flash.size_max[0]) : "");
    setSizeMaxH(flash.size_max?.[1] != null ? String(flash.size_max[1]) : "");
    setTags((flash.tags || []).map((t: any) => t.pt).filter(Boolean));
    // Overrides start blank even when editing — pre-filling them with the
    // current (possibly just auto-translated) text would silently lock it
    // in as a manual override on next save. The current value is shown as
    // a placeholder hint instead.
    setNameEnOverride(emptyForm.nameEnOverride);
    setNameEsOverride(emptyForm.nameEsOverride);
    setDescEnOverride(emptyForm.descEnOverride);
    setDescEsOverride(emptyForm.descEsOverride);

    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setLoadingImages(true);
    const loaded: ImageEntry[] = [];
    for (const img of flash.images || []) {
      try {
        const res = await fetch(img.original);
        const blob = await res.blob();
        const filename = img.original.split("/").pop() || "image.png";
        loaded.push({
          file: new File([blob], filename, { type: blob.type }),
          url: URL.createObjectURL(blob),
        });
      } catch {
        // skip images that fail to fetch — she can re-upload manually
      }
    }
    setImages(loaded);
    setLoadingImages(false);
  };

  const canSubmit =
    name.trim() !== "" &&
    slug.trim() !== "" &&
    price.trim() !== "" &&
    images.length > 0 &&
    !slugConflict;

  // Shared payload for both the .zip download and the direct GitHub push.
  const buildPayload = () => {
    const data: Record<string, unknown> = {
      name: name.trim(),
      tags,
      price: Number(price),
    };
    if (sizeMinW && sizeMinH) {
      data.size_min = [Number(sizeMinW), Number(sizeMinH)];
    }
    if (sizeMaxW && sizeMaxH) {
      data.size_max = [Number(sizeMaxW), Number(sizeMaxH)];
    }
    if (description.trim()) data.description = description.trim();

    const translations: Record<string, any> = {};
    if (nameEnOverride.trim() || descEnOverride.trim()) {
      translations.en = {
        ...(nameEnOverride.trim()
          ? { name: nameEnOverride.trim(), name_locked: true }
          : {}),
        ...(descEnOverride.trim()
          ? { description: descEnOverride.trim(), description_locked: true }
          : {}),
      };
    }
    if (nameEsOverride.trim() || descEsOverride.trim()) {
      translations.es = {
        ...(nameEsOverride.trim()
          ? { name: nameEsOverride.trim(), name_locked: true }
          : {}),
        ...(descEsOverride.trim()
          ? { description: descEsOverride.trim(), description_locked: true }
          : {}),
      };
    }
    if (Object.keys(translations).length) data.translations = translations;

    const yamlText = yaml.dump(data);
    const files = images.map((img, i) => {
      const ext = img.file.name.split(".").pop()?.toLowerCase() || "png";
      return { blob: img.file, name: `${i + 1}.${ext}` };
    });
    return { yamlText, files };
  };

  const buildAndDownload = async () => {
    const { yamlText, files } = buildPayload();
    const zip = new JSZip();
    const folder = zip.folder(slug)!;
    folder.file("data.yaml", yamlText);
    files.forEach((f) => folder.file(f.name, f.blob));

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const saveToken = async () => {
    const value = tokenInput.trim();
    if (!value) return;
    setTokenState("checking");
    setTokenError(null);
    const result = await verifyToken(value);
    if (result.ok) {
      setStoredToken(value);
      setToken(value);
      setTokenInput("");
      setTokenState("valid");
    } else {
      setTokenState("invalid");
      setTokenError(result.error || "Token inválido.");
    }
  };

  const clearToken = () => {
    setStoredToken("");
    setToken("");
    setTokenState("idle");
    setTokenError(null);
  };

  const handleUpload = async () => {
    const { yamlText, files } = buildPayload();

    // When editing, drop files from the old folder that the new version no
    // longer includes (renamed slug, fewer images, images renamed to 1..N).
    const newPaths = new Set([
      `public/flashes/${slug}/data.yaml`,
      ...files.map((f) => `public/flashes/${slug}/${f.name}`),
    ]);
    const removePaths: string[] = [];
    if (originalSlug) {
      if (originalSlug !== slug) {
        removePaths.push(`public/flashes/${originalSlug}/data.yaml`);
      }
      for (const img of loadedFlash?.images || []) {
        const p = repoPathFromImageUrl(img.original);
        if (p && !newPaths.has(p)) removePaths.push(p);
      }
    }

    setUploadState("uploading");
    setUploadError(null);
    setCommitUrl(null);
    try {
      const { commitUrl: url } = await commitFlash({
        token,
        slug,
        yamlText,
        images: files,
        message: originalSlug
          ? `Atualiza flash: ${name.trim()}`
          : `Novo flash: ${name.trim()}`,
        removePaths,
        onProgress: setUploadMsg,
      });
      setCommitUrl(url);
      setUploadState("done");
    } catch (e) {
      setUploadError((e as Error).message);
      setUploadState("error");
    }
  };

  const handleDelete = async () => {
    if (!originalSlug) return;
    const filePaths = (loadedFlash?.images || [])
      .map((img: any) => repoPathFromImageUrl(img.original))
      .filter(Boolean) as string[];

    setDeleteState("deleting");
    setUploadError(null);
    setCommitUrl(null);
    try {
      const { commitUrl: url } = await deleteFlash({
        token,
        slug: originalSlug,
        filePaths,
        message: `Apaga flash: ${loadedFlash?.name?.pt || originalSlug}`,
        onProgress: setUploadMsg,
      });
      setCommitUrl(url);
      setDeleteState("done");
      resetForm();
    } catch (e) {
      setUploadError((e as Error).message);
      setDeleteState("idle");
    }
  };

  const inputClass =
    "w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500";
  const smallInputClass =
    "w-full border border-zinc-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
  const labelClass = "block text-sm font-semibold text-zinc-700 mb-1";

  const sortedFlashOptions = Object.entries(allFlashes).sort((a, b) =>
    (a[1].name?.pt || "").localeCompare(b[1].name?.pt || ""),
  );

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-1">
          {originalSlug ? "Editar flash" : "Adicionar novo flash"}
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          Preencha os campos abaixo e baixe o arquivo .zip no final. As
          traduções (inglês/espanhol) são geradas automaticamente depois —
          aqui você só escreve em português, a menos que queira corrigir uma
          tradução manualmente.
        </p>

        <div className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>
              Carregar flash existente para editar (opcional)
            </label>
            <select
              className={inputClass}
              value={originalSlug ?? ""}
              onChange={(e) => loadExisting(e.target.value)}
            >
              <option value="">— Criar novo flash —</option>
              {sortedFlashOptions.map(([key, flash]) => (
                <option key={key} value={key}>
                  {flash.name?.pt || key}
                </option>
              ))}
            </select>
            {loadingImages && (
              <p className="text-xs text-zinc-400 mt-1">
                Carregando imagens existentes...
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Nome do flash *</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Gato preto"
            />
            {nameConflictSlug && (
              <p className="text-xs text-amber-600 mt-1">
                Já existe um flash com esse nome (pasta "{nameConflictSlug}
                "). Se quiser editá-lo, carregue-o na lista acima em vez de
                criar um novo.
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                className={smallInputClass}
                value={nameEnOverride}
                onChange={(e) => setNameEnOverride(e.target.value)}
                placeholder={
                  loadedFlash?.name?.en
                    ? `Nome em inglês — atual: ${loadedFlash.name.en}`
                    : "Nome em inglês (opcional)"
                }
              />
              <input
                className={smallInputClass}
                value={nameEsOverride}
                onChange={(e) => setNameEsOverride(e.target.value)}
                placeholder={
                  loadedFlash?.name?.es
                    ? `Nome em espanhol — atual: ${loadedFlash.name.es}`
                    : "Nome em espanhol (opcional)"
                }
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Pasta (gerado automaticamente, pode editar)
            </label>
            <input
              className={inputClass}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
            />
            {slugConflict && (
              <p className="text-xs text-red-600 mt-1">
                Já existe uma pasta com esse nome — baixar e subir isso vai
                substituir o flash existente. Escolha outra pasta se não era
                essa a intenção.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Descrição (opcional)</label>
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <textarea
                className={smallInputClass}
                rows={2}
                value={descEnOverride}
                onChange={(e) => setDescEnOverride(e.target.value)}
                placeholder={
                  loadedFlash?.description?.en
                    ? `Descrição em inglês — atual: ${loadedFlash.description.en}`
                    : "Descrição em inglês (opcional)"
                }
              />
              <textarea
                className={smallInputClass}
                rows={2}
                value={descEsOverride}
                onChange={(e) => setDescEsOverride(e.target.value)}
                placeholder={
                  loadedFlash?.description?.es
                    ? `Descrição em espanhol — atual: ${loadedFlash.description.es}`
                    : "Descrição em espanhol (opcional)"
                }
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Preço (€) *</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tamanho mín. (cm)</label>
              <div className="flex items-center gap-2">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="largura"
                  value={sizeMinW}
                  onChange={(e) => setSizeMinW(e.target.value)}
                />
                <span className="text-zinc-400">×</span>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="altura"
                  value={sizeMinH}
                  onChange={(e) => setSizeMinH(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Tamanho máx. (cm)</label>
              <div className="flex items-center gap-2">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="largura"
                  value={sizeMaxW}
                  onChange={(e) => setSizeMaxW(e.target.value)}
                />
                <span className="text-zinc-400">×</span>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="altura"
                  value={sizeMaxH}
                  onChange={(e) => setSizeMaxH(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-[#C9449E] text-white text-sm font-semibold rounded-full px-3 py-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:opacity-70 cursor-pointer"
                    aria-label={`Remover tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                className={inputClass}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Digite uma tag e aperte Enter"
              />
              {tagSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-zinc-200 rounded shadow mt-1 max-h-40 overflow-auto">
                  {tagSuggestions.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => addTag(s)}
                      className="block w-full text-left px-3 py-1.5 hover:bg-zinc-100 cursor-pointer"
                    >
                      {s} ({tagCounts[s]})
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Tags já usadas aparecem como sugestão, com quantos flashes já
              usam cada uma — reaproveitar evita criar tags quase-duplicadas.
            </p>
          </div>

          <div>
            <label className={labelClass}>Imagens *</label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={(e) => onFilesSelected(e.target.files)}
              className="block w-full text-sm text-zinc-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-teal-600 file:text-white file:font-semibold file:cursor-pointer cursor-pointer"
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {images.map((img, i) => (
                  <div key={img.url} className="relative w-20 h-20">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover rounded border border-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-zinc-900 text-white rounded-full w-5 h-5 text-xs leading-none cursor-pointer"
                      aria-label="Remover imagem"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <details className="mt-2 rounded border border-zinc-200 bg-zinc-50 p-3 text-sm">
            <summary className="cursor-pointer font-semibold text-zinc-700">
              {tokenState === "valid"
                ? "⚙️ GitHub conectado — publicar direto está ativado"
                : "⚙️ Conectar ao GitHub para publicar direto (opcional)"}
            </summary>
            <div className="mt-3 flex flex-col gap-2 text-zinc-600">
              {tokenState === "valid" ? (
                <>
                  <p>
                    Este navegador está conectado. O botão{" "}
                    <strong>"Publicar no site"</strong> abaixo envia tudo
                    direto, sem precisar baixar nada.
                  </p>
                  <button
                    type="button"
                    onClick={clearToken}
                    className="self-start text-red-600 underline cursor-pointer"
                  >
                    Desconectar este navegador
                  </button>
                </>
              ) : (
                <>
                  <p>
                    Com a sua conta do GitHub (que tem acesso ao repositório{" "}
                    <code>{REPO_SLUG}</code>), crie um{" "}
                    <a
                      href={CREATE_TOKEN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 underline"
                    >
                      token de acesso pessoal (classic)
                    </a>{" "}
                    marcando o escopo <em>repo</em> e definindo uma validade
                    (ex. 90 dias). Cole o token aqui — ele fica guardado só
                    neste navegador.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      className={inputClass}
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="ghp_..."
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={saveToken}
                      disabled={!tokenInput.trim() || tokenState === "checking"}
                      className="shrink-0 bg-zinc-800 hover:bg-zinc-900 disabled:bg-zinc-300 text-white font-semibold rounded px-4 cursor-pointer"
                    >
                      {tokenState === "checking" ? "Verificando…" : "Salvar"}
                    </button>
                  </div>
                  {tokenState === "invalid" && tokenError && (
                    <p className="text-red-600">{tokenError}</p>
                  )}
                </>
              )}
            </div>
          </details>

          {tokenState === "valid" && (
            <button
              type="button"
              disabled={!canSubmit || uploadState === "uploading"}
              onClick={handleUpload}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold rounded-full py-3 cursor-pointer transition-colors"
            >
              {uploadState === "uploading"
                ? uploadMsg || "Publicando…"
                : originalSlug
                  ? "Publicar alterações no site"
                  : "Publicar no site"}
            </button>
          )}

          <button
            type="button"
            disabled={!canSubmit || uploadState === "uploading"}
            onClick={buildAndDownload}
            className={
              (tokenState === "valid"
                ? "bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                : "bg-teal-600 hover:bg-teal-700 text-white") +
              " disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed font-bold rounded-full py-3 cursor-pointer transition-colors"
            }
          >
            Baixar .zip
          </button>

          {uploadState === "done" && (
            <div className="bg-teal-50 border border-teal-200 rounded p-4 text-sm text-zinc-700 leading-relaxed">
              <p className="font-bold mb-1">Publicado! 🎉</p>
              <p>
                O site atualiza sozinho em alguns minutos (as traduções para
                inglês e espanhol são geradas nesse processo).
              </p>
              {commitUrl && (
                <p className="mt-1">
                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 underline"
                  >
                    Ver o commit no GitHub
                  </a>
                </p>
              )}
            </div>
          )}

          {uploadState === "error" && uploadError && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700 leading-relaxed">
              <p className="font-bold mb-1">Não deu para publicar</p>
              <p>{uploadError}</p>
              <p className="mt-1 text-red-600">
                Você ainda pode usar o "Baixar .zip" e subir manualmente.
              </p>
            </div>
          )}

          {downloaded && (
            <div className="bg-teal-50 border border-teal-200 rounded p-4 text-sm text-zinc-700 leading-relaxed">
              <p className="font-bold mb-2">Prontinho! E agora?</p>
              <ol className="list-decimal list-inside flex flex-col gap-1">
                <li>Extraia o arquivo .zip baixado.</li>
                <li>
                  Você vai ver uma pasta chamada <code>{slug}</code> com as
                  imagens e um arquivo <code>data.yaml</code> dentro.
                </li>
                <li>
                  Abra{" "}
                  <a
                    href="https://github.com/joaorb64/fufutattoo/tree/main/public/flashes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 underline"
                  >
                    a pasta public/flashes no GitHub
                  </a>
                  , clique em "Add file" → "Upload files" e arraste essa
                  pasta (ou os arquivos de dentro dela).
                </li>
                <li>
                  Escreva uma mensagem como "Novo flash: {name}" e clique em
                  "Commit changes".
                </li>
                <li>O site atualiza sozinho em alguns minutos.</li>
              </ol>
              <p className="mt-2">
                Se preferir, é só mandar o .zip para o Joao que ele resolve.
              </p>
            </div>
          )}

          {deleteState === "done" && (
            <div className="bg-teal-50 border border-teal-200 rounded p-4 text-sm text-zinc-700 leading-relaxed">
              <p className="font-bold mb-1">Flash apagado</p>
              <p>O site atualiza sozinho em alguns minutos.</p>
              {commitUrl && (
                <p className="mt-1">
                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 underline"
                  >
                    Ver o commit no GitHub
                  </a>
                </p>
              )}
            </div>
          )}

          {originalSlug && tokenState === "valid" && deleteState !== "done" && (
            <div className="mt-4 border-t border-zinc-200 pt-4">
              {deleteState === "confirm" ? (
                <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
                  <p className="font-bold mb-2">
                    Apagar o flash "{loadedFlash?.name?.pt || originalSlug}"?
                  </p>
                  <p className="mb-3">
                    Isto remove a pasta <code>{originalSlug}</code> do
                    repositório num commit. Não dá para desfazer pelo editor.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-5 py-2 cursor-pointer"
                    >
                      Sim, apagar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteState("idle")}
                      className="border border-zinc-300 text-zinc-600 rounded-full px-5 py-2 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={deleteState === "deleting"}
                  onClick={() => setDeleteState("confirm")}
                  className="text-red-600 hover:text-red-700 underline text-sm cursor-pointer disabled:opacity-50"
                >
                  {deleteState === "deleting"
                    ? uploadMsg || "Apagando…"
                    : "Apagar este flash"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
