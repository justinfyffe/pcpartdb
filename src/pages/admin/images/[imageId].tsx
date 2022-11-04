import { AdminEditImagePage, AdminEditImagePageProps } from '@client/admin';
import { imageService } from '@server/images/image-service';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serializeAsync } from '@server/shared/types/serialize';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { imageId: string };
  const imageId = parseInt(query.imageId, 10);

  const image = await serializeAsync(imageService.get(imageId, ctx));

  return { image } as AdminEditImagePageProps;
});

export default AdminEditImagePage;
