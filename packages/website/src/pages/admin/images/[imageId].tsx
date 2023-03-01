import {
  AdminEditImagePage,
  AdminEditImagePageProps,
} from '@pcpartdb/website/client/admin/pages';
import { imageService } from '@pcpartdb/website/server/images/image-service';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { staffSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { imageId: string };
  const imageId = parseInt(query.imageId, 10);

  const image = await getImage(imageId, ctx);

  return { image } as AdminEditImagePageProps;
});

async function getImage(id: number, ctx: Context) {
  return await imageService.get(id, ctx);
}

export default AdminEditImagePage;
