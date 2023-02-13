import {
  AdminListImagesPage,
  AdminListImagesPageProps,
} from '@client/admin/pages';
import { imageService } from '@server/images/image-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const images = await getImages(ctx);

  return { images } as AdminListImagesPageProps;
});

async function getImages(ctx: Context) {
  return await imageService.list(ctx);
}

export default AdminListImagesPage;
