//
// List Games Request
//
import { ListRequest, ListResponse } from '../common';
import { Image, ImageManipulationPreset } from './common';
import { ListImagesAdditionalData, ListImagesQuery } from './lists';

export interface ListImagesRequest<
  TQuery extends ListImagesQuery = ListImagesQuery,
> extends ListRequest<TQuery> {}

export interface ListImagesResponse<
  TQuery extends ListImagesQuery = ListImagesQuery,
  TResult extends Image = Image,
> extends ListResponse<TQuery, TResult> {
  additionalData?: ListImagesAdditionalData;
}

//
// Create Image Request
//

export interface CreateImageRequest extends Omit<Image, 'id' | 'uploadedAt'> {
  manipulation?: ImageManipulationPreset;
  file?: File;
  tempPath?: string;
}

//
// Update Image Request
//

export interface UpdateImageRequest extends Omit<Image, 'id' | 'uploadedAt'> {
  manipulation?: ImageManipulationPreset;
  file?: File;
  tempPath?: string;
}
