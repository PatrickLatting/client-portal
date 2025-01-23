// src/types/window.d.ts

interface FileSystem {
    readFile(path: string, options?: { encoding?: string }): Promise<ArrayBuffer | string>;
}

declare global {
    interface Window {
        fs: FileSystem;
    }
}

export {};