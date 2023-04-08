import * as db from '@prisma/client';

export type GpuImageEntity = db.GpuImage & {
  image?: db.Image;
};
