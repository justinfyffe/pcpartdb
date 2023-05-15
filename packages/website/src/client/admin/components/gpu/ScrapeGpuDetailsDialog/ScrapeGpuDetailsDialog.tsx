import { GpuDataSource } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { gpuService } from '../../../../gpus';
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
} from '../../../../shared/components';
import {
  createScrapeContext,
  ScrapeGpuDetailsContext,
} from './ScrapeGpuDetailsContext';
import { ScrapeGpuField } from './ScrapeGpuField';
import { ScrapeName } from './ScrapeName';
import { ScrapeGpuDetailsResults } from './types';

interface ScrapeGpuDetailsDialogProps {
  sources: GpuDataSource[];
  onImport: (data: ScrapeGpuDetailsResults) => void;
}

export const ScrapeGpuDetailsDialog: FunctionComponent<
  ScrapeGpuDetailsDialogProps
> = (props) => {
  const { sources, onImport } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [context, setContext] = useState<ScrapeGpuDetailsResults>(null);

  useEffect(() => {
    async function scrapeGpu() {
      const results = await gpuService.scrapeGpuDetails({ sources });
      setContext(createScrapeContext(results));
      setLoading(false);
    }
    scrapeGpu();
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
        <ScrapeGpuDetailsContext.Provider value={context}>
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
                <ScrapeName />
                <ScrapeGpuField field="partNumber" />
                <ScrapeGpuField field="company" />
                <ScrapeGpuField field="marketSegment" />
                <ScrapeGpuField field="launchPrice" />
                <ScrapeGpuField field="releaseDate" />

                <ScrapeGpuField field="codename" />
                <ScrapeGpuField field="architecture" />
                <ScrapeGpuField field="processSize" />
                <ScrapeGpuField field="transistors" />

                <ScrapeGpuField field="memorySize" />
                <ScrapeGpuField field="memoryType" />
                <ScrapeGpuField field="memoryClock" />
                <ScrapeGpuField field="memoryInterface" />
                <ScrapeGpuField field="memoryBandwidth" />

                <ScrapeGpuField field="slotWidth" />
                <ScrapeGpuField field="length" />
                <ScrapeGpuField field="width" />
                <ScrapeGpuField field="height" />
                <ScrapeGpuField field="weight" />
                <ScrapeGpuField field="thermalDesignPower" />
                <ScrapeGpuField field="suggestedPsu" />
                <ScrapeGpuField field="busInterface" />
                <ScrapeGpuField field="powerConnectors" />
                <ScrapeGpuField field="outputs" />

                <ScrapeGpuField field="shaderUnitsCudaCores" />
                <ScrapeGpuField field="computeUnitsSmCount" />
                <ScrapeGpuField field="textureMappingUnits" />
                <ScrapeGpuField field="renderOutputUnits" />
                <ScrapeGpuField field="tensorCores" />
                <ScrapeGpuField field="rayTracingCores" />
                <ScrapeGpuField field="coreClockSpeedBase" />
                <ScrapeGpuField field="coreClockSpeedBoost" />
                <ScrapeGpuField field="l1Cache" />
                <ScrapeGpuField field="l2Cache" />

                <ScrapeGpuField field="pixelFillRate" />
                <ScrapeGpuField field="textureFillRate" />
                <ScrapeGpuField field="fp32Performance" />
                <ScrapeGpuField field="fp64Performance" />

                <ScrapeGpuField field="directxVersion" />
                <ScrapeGpuField field="openClVersion" />
                <ScrapeGpuField field="openGlVersion" />
                <ScrapeGpuField field="shaderModelVersion" />

                <ScrapeGpuField field="g3dMark" />
                <ScrapeGpuField field="g2dMark" />
                <ScrapeGpuField field="timespyGraphics" />
              </TBody>
            </Table>
          </div>
        </ScrapeGpuDetailsContext.Provider>
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
