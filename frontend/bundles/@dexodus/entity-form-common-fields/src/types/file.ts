export interface File {
    extension: string;
    id: number;
    isTemp: boolean
    mimeType: string;
    name: string;
    originalName: string;
    path: string
    savedAt: string;
    temporaryUrl: string;
}
