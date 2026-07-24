import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { isNativePlatform } from "@/mobile/nativePlatform";

export interface ShareOrDownloadFileInput {
  blob: Blob;
  fileName: string;
  title?: string;
}

function downloadBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read generated file."));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return reject(new Error("Unable to encode generated file."));
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(blob);
  });
}

export async function shareOrDownloadFile(input: ShareOrDownloadFileInput): Promise<void> {
  if (!isNativePlatform()) {
    downloadBlob(input.blob, input.fileName);
    return;
  }

  const path = `standard-playbook/${Date.now()}-${input.fileName}`;
  const data = await blobToBase64(input.blob);
  const written = await Filesystem.writeFile({ path, data, directory: Directory.Cache, recursive: true });

  try {
    await Share.share({
      title: input.title ?? "Standard Playbook",
      files: [written.uri],
      dialogTitle: input.title ?? "Share or save",
    });
  } finally {
    await Filesystem.deleteFile({ path, directory: Directory.Cache }).catch(() => undefined);
  }
}
