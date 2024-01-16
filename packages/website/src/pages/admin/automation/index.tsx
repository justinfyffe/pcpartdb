import { ApiError } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminAutomationPage } from 'packages/website/src/client/admin/pages/automation/AdminAutomationPage/AdminAutomationPage';
import { viewModelsClient } from 'packages/website/src/client/shared/api/viewModelsClient';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export async function getServerSideProps(ctx: NextPageContext) {
  const endpoint = 'admin/automation';
  try {
    const response = await viewModelsClient.get(endpoint, {
      nextPageContext: ctx,
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default withStaffGuard(AdminAutomationPage);
