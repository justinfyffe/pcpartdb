import { CompareGpusContentData, GpuComparison } from '@pcpartdb/shared';
import { getGpuName, getShoppingUrl } from '../../../utils';

export function getContentParams(
  comparison: GpuComparison,
  contentData: CompareGpusContentData,
) {
  const [gpu1, gpu2] = comparison;

  const gpuName1 = getGpuName(gpu1);
  const gpuName2 = getGpuName(gpu2);
  const shoppingUrl1 = getShoppingUrl(gpu1);
  const shoppingUrl2 = getShoppingUrl(gpu2);
  const shortGpuName1 = getGpuName(gpu1, { company: false });
  const shortGpuName2 = getGpuName(gpu2, { company: false });

  return {
    gpuName1,
    gpuName2,
    shoppingUrl1,
    shoppingUrl2,
    shortGpuName1,
    shortGpuName2,
  };
}
