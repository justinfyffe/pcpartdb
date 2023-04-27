import 'reflect-metadata';
import { GpuDiff } from '@pcpartdb/shared';
import { getGpuName } from 'packages/website/src/client/gpus';
import {
  Checkbox,
  showDialog,
  Td,
  Tr,
} from 'packages/website/src/client/shared/components';
import React, { useCallback, useContext, useMemo } from 'react';
import { ImportGpusPageContext } from '../../context';
import { PreviewDialog } from '../PreviewDialog';

interface ImportGpuRowProps {
  diff: GpuDiff;
}

export const ImportGpuRow = (props: ImportGpuRowProps) => {
  const { diff } = props;
  const { gpusToImport, onImportSelection } = useContext(ImportGpusPageContext);

  const isSelected = useMemo(
    () => gpusToImport[diff.updated.slug] != null,
    [diff.updated.slug, gpusToImport],
  );

  const gpuName = useMemo(() => getGpuName(diff.updated), [diff.updated]);

  const handlePreviewGpu = useCallback(() => {
    showDialog(<PreviewDialog diff={diff} />);
  }, [diff]);

  const handleImportCheck = useCallback(
    (checked: boolean) => {
      onImportSelection(diff, checked);
    },
    [diff, onImportSelection],
  );

  return (
    <Tr>
      <Td>
        <a onClick={() => handlePreviewGpu()} className="cursor-pointer">
          {gpuName}
        </a>
      </Td>
      <Td className="text-right">
        <Checkbox value={isSelected} onChange={handleImportCheck} />
      </Td>
    </Tr>
  );
};
