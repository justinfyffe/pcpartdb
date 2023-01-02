import { AboutPage } from '@client/legal/pages';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';

export const getServerSideProps = ssrPageProps(async (_ctx: SsrContext) => {});

export default AboutPage;
