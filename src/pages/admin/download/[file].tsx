import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import * as fileUtils from '@server/shared/utils/file-utils';
import * as fs from 'fs';
import React from 'react';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const { file } = ctx.page.query as { file: string };
  const path = fileUtils.exportsPath(file);

  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.setHeader('Content-Disposition', 'attachment');

  await new Promise((resolve) => {
    const stream = fs.createReadStream(path);
    stream.pipe(ctx.res);
    stream.on('end', resolve);
  });

  // Delete file, not needed anymore.
  await fileUtils.remove(path);
});

const EmptyPage = () => <></>;
export default EmptyPage;
