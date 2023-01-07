import { ApiContext } from '@server/shared/api/context';
import { staffController } from '@server/shared/api/controller';
import * as uploads from '@server/shared/uploads/file-utils';
import fs from 'fs/promises';
import { exportService } from './export-service';

export const exportContent = staffController(async (ctx: ApiContext) => {
  const filePath = await exportService.exportContent(ctx);

  ctx.res.setHeader('Content-Type', 'application/gzip');
  ctx.res.setHeader('Content-Disposition', 'attachment; filename=content.tgz');
  ctx.res.send(await fs.readFile(filePath));
});

export const importContent = staffController(async (ctx: ApiContext) => {
  await uploads.uploadFile('file', ctx);

  const body = ctx.req.body;
  const tempPath = body.tempPath;

  return await exportService.importContent(tempPath, ctx);
});
