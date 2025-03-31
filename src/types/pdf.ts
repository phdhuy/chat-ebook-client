export interface PDFMetadataInfo {
  Title?: string;
  Author?: string;
}

export interface Bookmark {
  pageNumber: number;
  title: string;
  timestamp: Date;
}

export interface PdfOutlineItem {
    title: string;
    dest?: string | any[] | null;
    items?: PdfOutlineItem[];
  }
