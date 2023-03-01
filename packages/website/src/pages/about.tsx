import { AboutPage } from '@pcpartdb/website/client/legal/pages';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { ssrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

export const getServerSideProps = ssrPageProps(async (_ctx: SsrContext) => {});

export default AboutPage;
