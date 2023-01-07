import { partImportExportService } from '@server/part/part-import-export-service';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import * as uploads from '@server/shared/uploads/file-utils';
import * as fs from 'fs';
import React from 'react';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const { file } = ctx.page.query as { file: string };

  ctx.res.setHeader('Content-Type', 'application/gzip');
  ctx.res.setHeader('Content-Disposition', 'attachment');

  await new Promise((resolve) => {
    const stream = fs.createReadStream(uploads.exportsPath(file));
    stream.pipe(ctx.res);
    stream.on('end', resolve);
  });

  await partImportExportService.deleteArchive(file);
});

const EmptyPage = () => <></>;
export default EmptyPage;
