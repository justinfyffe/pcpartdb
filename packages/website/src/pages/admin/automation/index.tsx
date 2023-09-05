import { NextPageContext } from 'next';
import { AdminAutomationPage } from 'packages/website/src/client/admin/pages/automation/AdminAutomationPage/AdminAutomationPage';
import { viewModelsClient } from 'packages/website/src/client/shared/api/viewModelsClient';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export async function getServerSideProps(_ctx: NextPageContext) {
  const endpoint = 'admin/automation';
  return await viewModelsClient.get(endpoint);
}

export default withStaffGuard(AdminAutomationPage);
