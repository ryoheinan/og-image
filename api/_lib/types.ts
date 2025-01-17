export type FileType = 'png' | 'jpeg';

export interface ParsedRequest {
    fileType: FileType;
    text: string;
    textColor: string;
    md: boolean;
    fontSize: string;
    marginTop: string;
    background?: string;
}
