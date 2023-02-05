import { gpuService } from '@client/gpus';
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
} from '@client/shared/components';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImportGpuBenchmark } from './import-gpu-benchmark';
import {
  createImportContext,
  ImportGpuDataContext,
} from './import-gpu-data-context';
import { ImportGpuSpec } from './import-gpu-spec';
import { ImportName } from './import-name';
import { ImportGpuDataResults } from './import-types';

interface ImportGpuDataDialogProps {
  url: string;
  onImport: (data: ImportGpuDataResults) => void;
}

export const ImportGpuDataDialog: FunctionComponent<
  ImportGpuDataDialogProps
> = (props) => {
  const { url, onImport } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [context, setContext] = useState<ImportGpuDataResults>(null);

  useEffect(() => {
    async function importGpu() {
      const results = await gpuService.importGpuData({ url });
      setContext(createImportContext(results));
      setLoading(false);
    }
    importGpu();
  }, [url]);

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
                <ImportGpuSpec spec="company" />
                <ImportGpuSpec spec="marketSegment" />
                <ImportGpuSpec spec="launchPrice" />
                <ImportGpuSpec spec="releaseDate" />

                <ImportGpuSpec spec="codename" />
                <ImportGpuSpec spec="architecture" />
                <ImportGpuSpec spec="processSize" />
                <ImportGpuSpec spec="transistors" />

                <ImportGpuSpec spec="memorySize" />
                <ImportGpuSpec spec="memoryType" />
                <ImportGpuSpec spec="memoryClock" />
                <ImportGpuSpec spec="memoryInterface" />
                <ImportGpuSpec spec="memoryBandwidth" />

                <ImportGpuSpec spec="slotWidth" />
                <ImportGpuSpec spec="length" />
                <ImportGpuSpec spec="width" />
                <ImportGpuSpec spec="height" />
                <ImportGpuSpec spec="weight" />
                <ImportGpuSpec spec="thermalDesignPower" />
                <ImportGpuSpec spec="suggestedPsu" />
                <ImportGpuSpec spec="busInterface" />
                <ImportGpuSpec spec="powerConnectors" />
                <ImportGpuSpec spec="outputs" />

                <ImportGpuSpec spec="shaderUnitsCudaCores" />
                <ImportGpuSpec spec="textureMappingUnits" />
                <ImportGpuSpec spec="renderOutputUnits" />
                <ImportGpuSpec spec="tensorCores" />
                <ImportGpuSpec spec="rayTracingCores" />
                <ImportGpuSpec spec="coreClockSpeedBase" />
                <ImportGpuSpec spec="coreClockSpeedBoost" />
                <ImportGpuSpec spec="l1Cache" />
                <ImportGpuSpec spec="l2Cache" />

                <ImportGpuSpec spec="pixelFillRate" />
                <ImportGpuSpec spec="textureFillRate" />
                <ImportGpuSpec spec="fp32Performance" />
                <ImportGpuSpec spec="fp64Performance" />

                <ImportGpuSpec spec="directxVersion" />
                <ImportGpuSpec spec="openClVersion" />
                <ImportGpuSpec spec="openGlVersion" />
                <ImportGpuSpec spec="shaderModelVersion" />

                <ImportGpuBenchmark benchmark="g3dMark" />
                <ImportGpuBenchmark benchmark="g2dMark" />
                <ImportGpuBenchmark benchmark="timespyGraphics" />
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
