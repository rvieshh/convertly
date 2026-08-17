// Tools dropdown menu data, grouped like CloudConvert. "Convert Files" links
// point to real category pages; "Optimize Files" links point to real optimize
// tools. Each link carries an icon name resolved in the Header.
export interface ToolLink {
  label: string;
  href: string;
  icon: string; // key into ICmyonMap in Header
}
export interface ToolGroup {
  title: string;
  links: ToolLink[];
}

export const CONVERT_GROUP: ToolGroup = {
  title: "Convert Files",
  links: [
    { label: "Image Converter", href: "/image-converter", icon: "image" },
    { label: "Video Converter", href: "/video-converter", icon: "video" },
    { label: "Audio Converter", href: "/audio-converter", icon: "audio" },
    { label: "Document Converter", href: "/document-converter", icon: "document" },
    { label: "Spreadsheet Converter", href: "/spreadsheet-converter", icon: "spreadsheet" },
    { label: "Presentation Converter", href: "/slides-converter", icon: "slides" },
    { label: "Ebook Converter", href: "/ebook-converter", icon: "ebook" },
    { label: "Font Converter", href: "/font-converter", icon: "font" },
    { label: "Vector Converter", href: "/vector-converter", icon: "vector" },
    { label: "Archive Converter", href: "/archive-converter", icon: "archive" },
    { label: "Camera RAW Converter", href: "/raw-converter", icon: "raw" },
  ],
};

export const OPTIMIZE_GROUP: ToolGroup = {
  title: "Optimize Files",
  links: [
    { label: "Compress PDF", href: "/compress-pdf", icon: "pdf" },
    { label: "Compress PNG", href: "/compress-png", icon: "image" },
    { label: "Compress JPG", href: "/compress-jpg", icon: "image" },
    { label: "PDF OCR", href: "/pdf-ocr", icon: "ocr" },
  ],
};

export const POPULAR_GROUP: ToolGroup = {
  title: "Popular",
  links: [
    { label: "PNG to JPG", href: "/png-to-jpg", icon: "image" },
    { label: "MP4 to MP3", href: "/mp4-to-mp3", icon: "audio" },
    { label: "DOCX to PDF", href: "/docx-to-pdf", icon: "document" },
    { label: "EPUB to MOBI", href: "/epub-to-mobi", icon: "ebook" },
  ],
};

// Legacy export kept for any old imports.
export const TOOL_GROUPS: ToolGroup[] = [CONVERT_GROUP, POPULAR_GROUP];
