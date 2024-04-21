import { schema } from 'normalizr';
import { productNormalizr, relativeDataProductsNormalizr } from './schemas';

export const compareCpusViewModelNormalizr = new schema.Object({
  comparison: [productNormalizr],
  relatedCpus: [productNormalizr],
  relatedCpuComparisons: [[productNormalizr]],
  relativeDataProducts: relativeDataProductsNormalizr,
});

export const compareGpusViewModelNormalizr = new schema.Object({
  comparison: [productNormalizr],
  relatedGpus: [productNormalizr],
  relatedGpuComparisons: [[productNormalizr]],
  relativeDataProducts: relativeDataProductsNormalizr,
});

export const viewCpuViewModelNormalizr = new schema.Object({
  cpu: productNormalizr,
  relatedCpus: [productNormalizr],
  relatedCpuComparisons: [[productNormalizr]],
  relativeDataProducts: relativeDataProductsNormalizr,
});

export const viewGpuViewModelNormalizr = new schema.Object({
  gpu: productNormalizr,
  relatedGpus: [productNormalizr],
  relatedGpuComparisons: [[productNormalizr]],
  relativeDataProducts: relativeDataProductsNormalizr,
});
