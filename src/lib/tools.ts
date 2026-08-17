// Tools dropdown menu data, grouped like CloudConvert. Every "Convert Files"
// link points to a real category page (/image-converter, /document-converter,
// ...); the Popular column links to real conversion pages.
export interface ToolLink {
  label: string;
  href: string;
}
export interface ToolGroup {
  title: string;
  links: ToolLink[];
}

export const TOOL_GROUPS: ToolGroup[] = [
  {
    title: "Convert Files",
    links: [
      { label: "Image Converter", href: "/image-converter" },
      { label: "Video Converter", href: "/video-converter" },
      { label: "Audio Converter", href: "/audio-converter" },
      { label: "Document Converter", href: "/document-converter" },
      { label: "Spreadsheet Converter", href: "/spreadsheet-converter" },
      { label: "Presentation Converter", href: "/slides-converter" },
      { label: "Ebook Converter", href: "/ebook-converter" },
      { label: "Font Converter", href: "/font-converter" },
      { label: "Vector Converter", href: "/vector-converter" },
      { label: "Archive Converter", href: "/archive-converter" },
      { label: "Camera RAW Converter", href: "/raw-converter" },
    ],
  },
  {
    title: "Popular",
    links: [
      { label: "PNG to JPG", href: "/png-to-jpg" },
      { label: "JPG to PNG", href: "/jpg-to-png" },
      { label: "PNG to WebP", href: "/png-to-webp" },
      { label: "HEIC to JPG", href: "/heic-to-jpg" },
      { label: "MP4 to MP3", href: "/mp4-to-mp3" },
      { label: "MOV to MP4", href: "/mov-to-mp4" },
      { label: "DOCX to PDF", href: "/docx-to-pdf" },
      { label: "EPUB to MOBI", href: "/epub-to-mobi" },
    ],
  },
];
