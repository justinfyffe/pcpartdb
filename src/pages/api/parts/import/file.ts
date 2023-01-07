import { importPartsFile } from '@server/part/part-controller';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default importPartsFile;
