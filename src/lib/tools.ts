// Tools dropdown menu data, grouped like CloudConvert. Links point to the
// per-format / per-category converter routes.
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
    ],
  },
  {
    title: "Popular",
    links: [
      { label: "PNG to WebP", href: "/png-converter" },
      { label: "JPG to PNG", href: "/jpg-converter" },
      { label: "MP4 to MP3", href: "/mp4-converter" },
      { label: "WebP to JPG", href: "/webp-converter" },
    ],
  },
];
