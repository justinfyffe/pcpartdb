import { NextPageContext } from 'next';
import { viewModelsClient } from 'packages/website/src/client/shared/api';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminAutomationPage } from '../../../client/admin';

export async function getServerSideProps(_ctx: NextPageContext) {
  const endpoint = 'admin/automation';
  return await viewModelsClient.get(endpoint);
}

export default withStaffGuard(AdminAutomationPage);
