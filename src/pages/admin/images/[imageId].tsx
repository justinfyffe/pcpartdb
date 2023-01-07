import {
  AdminEditImagePage,
  AdminEditImagePageProps,
} from '@client/admin/pages';
import { imageService } from '@server/images/image-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { imageId: string };
  const imageId = parseInt(query.imageId, 10);

  const image = await getImage(imageId, ctx);

  return { image } as AdminEditImagePageProps;
});

async function getImage(id: number, ctx: Context) {
  const image = await imageService.get(id, ctx);

  return serialize(image);
}

export default AdminEditImagePage;
