import 'reflect-metadata';
import { GpuDiff } from '@pcpartdb/shared';
import { Table, TBody } from 'packages/website/src/client/shared/components';
import React from 'react';
import { ImportGpuRow } from './ImportGpuRow';

interface ImportGpusTableProps {
  diffs: GpuDiff[];
}

export const ImportGpusTable = (props: ImportGpusTableProps) => {
  const { diffs } = props;

  return (
    <Table>
      <TBody>
        {diffs.map((diff) => (
          <ImportGpuRow key={diff.updated.slug} diff={diff} />
        ))}
      </TBody>
    </Table>
  );
};
