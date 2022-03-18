interface GalleryDLMeta {
  category: string
  date: string
  description: string
  fullname: string
  likes: number
  owner_id: string
  post_id: string
  post_shortcode: string
  post_url: string
  subcategory: string
  typename: string
  username: string
  display_url?: string
  extension?: string
  filename?: string
  height?: number
  media_id?: string
  num?: number
  shortcode?: string
  sidecar_media_id?: string
  sidecar_shortcode?: string
  video_url?: null | string
  width?: number
}

export type GalleryDLOutput = [2, GalleryDLMeta] | [3, string, GalleryDLMeta]
