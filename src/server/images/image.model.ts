import { Model, PartialModelObject } from 'objection';
import { Image } from '../../shared/image';
import { Serializable } from '../shared/types/serialize';

export class ImageModel extends Model implements Serializable<Image> {
  static tableName = 'images';

  // Fields
  id!: number;
  path!: string;
  name!: string;

  sourceName?: string;
  sourceUrl?: string;

  fileSize!: number;
  height!: number;
  width!: number;

  uploadedAt!: Date;

  serialize(): Image {
    return {
      id: this.id,
      path: this.path,
      name: this.name,
      sourceName: this.sourceName,
      sourceUrl: this.sourceUrl,
      fileSize: this.fileSize,
      height: this.height,
      width: this.width,
      uploadedAt: this.uploadedAt.getTime(),
    };
  }
}

export type ImageModelPojo = PartialModelObject<ImageModel>;
