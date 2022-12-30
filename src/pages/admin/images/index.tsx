import {
  AdminListImagesPage,
  AdminListImagesPageProps,
} from '@client/admin/pages';
import { imageService } from '@server/images/image-service';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serializeAsync } from '@server/shared/types/serialize';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const images = await serializeAsync(imageService.list(ctx));

  return { images } as AdminListImagesPageProps;
});

export default AdminListImagesPage;
