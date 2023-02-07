export interface Image {
  id?: number;
  path: string;
  name: string;

  sourceName?: string;
  sourceUrl?: string;

  fileSize?: number;
  height?: number;
  width?: number;

  uploadedAt: number;
}

export interface ImageMeta {
  fileSize: number;
  height: number;
  width: number;
}

export interface CreateImageRequest extends Omit<Image, 'id'> {
  file?: File;
  tempPath?: string;
}

export interface UpdateImageRequest extends Omit<Image, 'id'> {
  file?: File;
  tempPath?: string;
}
