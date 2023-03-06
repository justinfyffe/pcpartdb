import {
  GpuOrder,
  GpuSort,
  LIST_PRESETS,
  ListGpusRequest,
  ListPresetSlug,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query;

  const company = (query.company as string)?.split(',');
  const sort = (query.sort as GpuSort) || GpuSort.PerformanceRating;
  const order = query.order as GpuOrder;
  const preset = query.preset as ListPresetSlug;

  let request: ListGpusRequest;
  if (preset != null && LIST_PRESETS[preset] != null) {
    request = { query: LIST_PRESETS[preset] };
  } else {
    request = {
      query: {
        filter: { company },
        orderBy: { sort, order },
      },
    };
  }

  return await viewModelsClient.get('gpus/list', {
    params: { q: JSON.stringify(request) },
  });
}

export default ListGpusPage;
