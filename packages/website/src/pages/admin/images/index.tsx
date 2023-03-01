import {
  AdminListImagesPage,
  AdminListImagesPageProps,
} from '@pcpartdb/website/client/admin/pages';
import { imageService } from '@pcpartdb/website/server/images/image-service';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { staffSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const images = await getImages(ctx);

  return { images } as AdminListImagesPageProps;
});

async function getImages(ctx: Context) {
  return await imageService.list(ctx);
}

export default AdminListImagesPage;
