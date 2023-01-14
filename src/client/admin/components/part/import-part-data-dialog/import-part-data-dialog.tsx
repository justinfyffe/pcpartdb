import { partService } from '@client/part';
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
import { ImportBenchmark } from './import-benchmark';
import { ImportName } from './import-name';
import {
  createImportContext,
  ImportPartDataContext,
} from './import-part-data-context';
import { ImportSpec } from './import-spec';
import { ImportPartDataResults } from './import-types';

interface ImportPartDataDialogProps {
  url: string;
  onImport: (data: ImportPartDataResults) => void;
}

export const ImportPartDataDialog: FunctionComponent<
  ImportPartDataDialogProps
> = (props) => {
  const { url, onImport } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [context, setContext] = useState<ImportPartDataResults>(null);

  useEffect(() => {
    async function importPart() {
      const results = await partService.importPartData({ url });
      setContext(createImportContext(results));
      setLoading(false);
    }
    importPart();
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
        <ImportPartDataContext.Provider value={context}>
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
                <ImportSpec spec="company" />
                <ImportSpec spec="marketSegment" />
                <ImportSpec spec="launchPrice" />
                <ImportSpec spec="releaseDate" />

                <ImportSpec spec="gpuName" />
                <ImportSpec spec="architecture" />
                <ImportSpec spec="processSize" />
                <ImportSpec spec="transistors" />

                <ImportSpec spec="memorySize" />
                <ImportSpec spec="memoryType" />
                <ImportSpec spec="memoryClock" />
                <ImportSpec spec="memoryInterface" />
                <ImportSpec spec="memoryBandwidth" />

                <ImportSpec spec="slotWidth" />
                <ImportSpec spec="length" />
                <ImportSpec spec="width" />
                <ImportSpec spec="height" />
                <ImportSpec spec="weight" />
                <ImportSpec spec="thermalDesignPower" />
                <ImportSpec spec="suggestedPsu" />
                <ImportSpec spec="busInterface" />
                <ImportSpec spec="powerConnectors" />
                <ImportSpec spec="outputs" />

                <ImportSpec spec="shaderUnitsCudaCores" />
                <ImportSpec spec="textureMappingUnits" />
                <ImportSpec spec="renderOutputUnits" />
                <ImportSpec spec="tensorCores" />
                <ImportSpec spec="rayTracingCores" />
                <ImportSpec spec="coreClockSpeedBase" />
                <ImportSpec spec="coreClockSpeedBoost" />
                <ImportSpec spec="l1Cache" />
                <ImportSpec spec="l2Cache" />

                <ImportSpec spec="pixelFillRate" />
                <ImportSpec spec="textureFillRate" />
                <ImportSpec spec="fp32Performance" />
                <ImportSpec spec="fp64Performance" />

                <ImportSpec spec="directXVersion" />
                <ImportSpec spec="openClVersion" />
                <ImportSpec spec="openGlVersion" />
                <ImportSpec spec="shaderModelVersion" />

                <ImportBenchmark benchmark="g3dMark" />
                <ImportBenchmark benchmark="g2dMark" />
                <ImportBenchmark benchmark="timeSpyGraphics" />
              </TBody>
            </Table>
          </div>
        </ImportPartDataContext.Provider>
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
