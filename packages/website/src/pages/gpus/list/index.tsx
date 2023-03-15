import {
  GpuOrder,
  GpuSort,
  LIST_PRESETS,
  ListGpusRequest,
  ListPresetSlug,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from '../../../client/gpus/pages';
import { DEFAULT_LIST_GPUS_LIMIT } from '../../../client/gpus/pages/list-gpus/utils';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query;

  const offset = Number(query.offset ?? 0);
  const limit = Number(query.limit ?? DEFAULT_LIST_GPUS_LIMIT);

  const company = (query.company as string)?.split(',');
  const sort = (query.sort as GpuSort) || GpuSort.PerformanceRating;
  const order = query.order as GpuOrder;
  const preset = query.preset as ListPresetSlug;

  let request: ListGpusRequest;
  if (preset != null && LIST_PRESETS[preset] != null) {
    request = { query: { ...LIST_PRESETS[preset], limit, offset } };
  } else {
    request = {
      query: {
        filter: { company },
        orderBy: { sort, order },
        offset,
        limit,
      },
    };
  }

  return await viewModelsClient.get('gpus/list', {
    params: { q: JSON.stringify(request) },
  });
}

export default ListGpusPage;
