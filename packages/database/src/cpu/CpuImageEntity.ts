import * as db from '@prisma/client';

export type CpuImageEntity = db.CpuImage & {
  image?: db.Image;
};
