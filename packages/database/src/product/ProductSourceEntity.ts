import * as db from '@prisma/client';
import { GpuEntity } from '../gpu';

export type ProductSourceEntity = db.ProductSource & { gpuChipset?: GpuEntity };
