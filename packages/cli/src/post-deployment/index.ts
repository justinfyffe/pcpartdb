import { postDeployment } from './postDeployment';

export interface PostDeploymentCommandArgs {}

export async function postDeploymentCommand(_args: PostDeploymentCommandArgs) {
  await postDeployment();
}
