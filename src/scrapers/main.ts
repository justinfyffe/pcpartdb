import 'module-alias/register';
import { importBulk } from './techpowerup';

importBulk().catch((err) => {
  console.log(err);
});
