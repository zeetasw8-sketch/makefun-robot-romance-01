// Robot Romance: a single pickup line, written by a lovestruck machine.
// This script copies the approved line from line.txt into entry.txt
// exactly as-is, so the submitted text never gains an extra newline.

import * as filesystem from "node:fs";
import * as pathTools from "node:path";
import { fileURLToPath } from "node:url";

// Folder holding this script, found from its own module URL.
const folderProgram: string = pathTools.dirname(fileURLToPath(import.meta.url));

// Where the finished line has to land; the harness sets this,
// and /output is the fallback when nothing is set.
const folderHasil: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function muatKalimat(): string {
  const mentah: string = filesystem.readFileSync(
    pathTools.join(folderProgram, "line.txt"),
    "utf-8",
  );
  // Drop only line breaks at the very end; every other character stays untouched.
  return mentah.replace(/(\r\n|\n|\r)+$/, "");
}

function pastikanPanjangValid(kalimat: string): void {
  if (kalimat.length < 1 || kalimat.length > 200) {
    throw new Error(
      `Panjang baris harus 1-200 karakter, dapat ${kalimat.length}.`,
    );
  }
}

function pastikanSatuKalimat(kalimat: string): void {
  pastikanPanjangValid(kalimat);
  const penandaAkhir: string[] = kalimat.match(/[.!?]/g) ?? [];
  const diakhiriTanda: boolean = /[.!?]$/.test(kalimat);
  if (penandaAkhir.length !== 1 || !diakhiriTanda) {
    throw new Error("Baris harus berupa tepat satu kalimat.");
  }
}

function tulisHasil(kalimat: string): void {
  filesystem.mkdirSync(folderHasil, { recursive: true });
  filesystem.writeFileSync(
    pathTools.join(folderHasil, "entry.txt"),
    kalimat,
    "utf-8",
  );
}

function jalankan(): void {
  const kalimat: string = muatKalimat();
  pastikanSatuKalimat(kalimat);
  tulisHasil(kalimat);
  console.log(kalimat);
}

jalankan();
