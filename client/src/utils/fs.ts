// src/utils/fs.ts

interface FileSystem {
    readFile(path: string, options?: { encoding?: string }): Promise<ArrayBuffer | string>;
  }
  
  // Initialize the file system
  export const initFileSystem = (): void => {
    if (!window.fs) {
      window.fs = {
        readFile: async (path: string, options?: { encoding?: string }): Promise<ArrayBuffer | string> => {
          try {
            const response = await fetch(`/src/assets/data/${path}`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            if (options?.encoding === 'binary' || options?.encoding === 'utf8') {
              return await response.text();
            }
            
            return await response.arrayBuffer();
          } catch (error) {
            console.error('Error reading file:', error);
            throw error;
          }
        }
      };
    }
  };