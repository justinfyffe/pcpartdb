import { gpuService } from '@pcpartdb/website/client/gpus';
import {
  Button,
  ButtonVariant,
  closeDialog,
  Spinner,
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '@pcpartdb/website/client/shared/components';
import { GpuDataSource } from '@pcpartdb/website/shared/gpus';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  createImportContext,
  ImportGpuDataContext,
} from './import-gpu-data-context';
import { ImportGpuField } from './import-gpu-field';
import { ImportName } from './import-name';
import { ImportGpuDataResults } from './import-types';

interface ImportGpuDataDialogProps {
  sources: GpuDataSource[];
  onImport: (data: ImportGpuDataResults) => void;
}

export const ImportGpuDataDialog: FunctionComponent<
  ImportGpuDataDialogProps
> = (props) => {
  const { sources, onImport } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [context, setContext] = useState<ImportGpuDataResults>(null);

  useEffect(() => {
    async function importGpu() {
      const results = await gpuService.importGpuData({ sources });
      setContext(createImportContext(results));
      setLoading(false);
    }
    importGpu();
    // Should only run once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = useCallback(() => {
    onImport(context);
    closeDialog();
  }, [onImport, context]);

  const handleCancel = useCallback(() => {
    closeDialog();
  }, []);

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      {loading && (
        <div className="flex flex-col items-center justify-center h-full w-full gap-6">
          <Spinner className="w-24 h-24 border-3" />
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-center">Importing data.</h3>
            <div className="text-lg">This may take a moment.</div>
          </div>
        </div>
      )}

      {!loading && (
        <ImportGpuDataContext.Provider value={context}>
          <div className="flex-1 max-h-[calc(100%_-_50px)] overflow-auto">
            <Table>
              <THead>
                <Tr sticky>
                  <Th>Field</Th>
                  <Th>Value</Th>
                  <Th className="text-right">Import?</Th>
                </Tr>
              </THead>
              <TBody>
                <ImportName />
                <ImportGpuField field="company" />
                <ImportGpuField field="marketSegment" />
                <ImportGpuField field="launchPrice" />
                <ImportGpuField field="releaseDate" />

                <ImportGpuField field="codename" />
                <ImportGpuField field="architecture" />
                <ImportGpuField field="processSize" />
                <ImportGpuField field="transistors" />

                <ImportGpuField field="memorySize" />
                <ImportGpuField field="memoryType" />
                <ImportGpuField field="memoryClock" />
                <ImportGpuField field="memoryInterface" />
                <ImportGpuField field="memoryBandwidth" />

                <ImportGpuField field="slotWidth" />
                <ImportGpuField field="length" />
                <ImportGpuField field="width" />
                <ImportGpuField field="height" />
                <ImportGpuField field="weight" />
                <ImportGpuField field="thermalDesignPower" />
                <ImportGpuField field="suggestedPsu" />
                <ImportGpuField field="busInterface" />
                <ImportGpuField field="powerConnectors" />
                <ImportGpuField field="outputs" />

                <ImportGpuField field="shaderUnitsCudaCores" />
                <ImportGpuField field="computeUnitsSmCount" />
                <ImportGpuField field="textureMappingUnits" />
                <ImportGpuField field="renderOutputUnits" />
                <ImportGpuField field="tensorCores" />
                <ImportGpuField field="rayTracingCores" />
                <ImportGpuField field="coreClockSpeedBase" />
                <ImportGpuField field="coreClockSpeedBoost" />
                <ImportGpuField field="l1Cache" />
                <ImportGpuField field="l2Cache" />

                <ImportGpuField field="pixelFillRate" />
                <ImportGpuField field="textureFillRate" />
                <ImportGpuField field="fp32Performance" />
                <ImportGpuField field="fp64Performance" />

                <ImportGpuField field="directxVersion" />
                <ImportGpuField field="openClVersion" />
                <ImportGpuField field="openGlVersion" />
                <ImportGpuField field="shaderModelVersion" />

                <ImportGpuField field="g3dMark" />
                <ImportGpuField field="g2dMark" />
                <ImportGpuField field="timespyGraphics" />
              </TBody>
            </Table>
          </div>
        </ImportGpuDataContext.Provider>
      )}

      <div className="flex justify-between">
        <Button variant={ButtonVariant.Default} onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant={ButtonVariant.Primary} onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
};
