import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  DEFAULT_LIST_GPUS_SORT,
  GpuOrder,
  GpuSort,
  LIST_GPUS_PRESETS,
  ListGpusPresetSlug,
  ListGpusRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query;

  const offset = Number(query.offset ?? DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(query.limit ?? DEFAULT_LIST_GPUS_LIMIT);

  const company = (query.company as string)?.split(',');
  const sort = (query.sort as GpuSort) || DEFAULT_LIST_GPUS_SORT;
  const order = query.order as GpuOrder;
  const preset = query.preset as ListGpusPresetSlug;

  let request: ListGpusRequest;
  if (preset != null && LIST_GPUS_PRESETS[preset] != null) {
    request = { query: { ...LIST_GPUS_PRESETS[preset], limit, offset } };
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
