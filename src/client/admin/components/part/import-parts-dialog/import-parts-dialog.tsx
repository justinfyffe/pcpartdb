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
import { ImportPartsResponse } from '@shared/part';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImportId } from './import-id';
import { ImportName } from './import-name';
import { ImportPartsContext } from './import-parts-context';
import { ImportSpec } from './import-spec';

interface ImportPartsDialogProps {
  file?: File;
}

export const ImportPartsDialog: FunctionComponent<ImportPartsDialogProps> = (
  props,
) => {
  const { file } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [importResults, setImportResults] = useState<ImportPartsResponse>(null);

  const [partCounter, setPartCounter] = useState<number>(0);
  const partToImport = importResults?.parts?.[partCounter] || null;

  useEffect(() => {
    async function importParts() {
      const results = await partService.importParts(file);
      setImportResults(results);
      setLoading(false);
    }
    importParts();
  }, [file]);

  const handleSkip = useCallback(async () => {
    if (partCounter + 1 >= importResults.parts.length) {
      closeDialog();
    } else {
      setPartCounter(partCounter + 1);
    }
  }, [importResults, partCounter]);

  const handleApply = useCallback(async () => {
    if (partToImport.id == null) {
      await partService.create({
        ...partToImport,
        id: undefined,
      });
    } else {
      await partService.update(partToImport.id, {
        ...partToImport,
        id: undefined,
      });
    }

    if (partCounter + 1 >= importResults.parts.length) {
      closeDialog();
    } else {
      setPartCounter(partCounter + 1);
    }
  }, [importResults, partCounter, partToImport]);

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

      {!loading && partToImport != null && (
        <ImportPartsContext.Provider value={partToImport}>
          <div>
            <h3 className="mb-1">Import Part?</h3>

            {partToImport.id == null ? (
              <p>
                This will create a new part in the database. Images are
                excluded.
              </p>
            ) : (
              <p>
                This will overwrite the part with id {partToImport.id} in the
                database. Images are excluded.
              </p>
            )}
          </div>

          <div className="flex-1 max-h-[calc(100%_-_50px)] overflow-auto">
            <Table>
              <THead>
                <Tr sticky>
                  <Th className="w-4/12">Field</Th>
                  <Th>Value</Th>
                </Tr>
              </THead>
              <TBody>
                <ImportId />
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
              </TBody>
            </Table>
          </div>
        </ImportPartsContext.Provider>
      )}

      <div className="flex justify-between">
        <Button variant={ButtonVariant.Default} onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant={ButtonVariant.Primary} onClick={handleSkip}>
          Skip
        </Button>
        <Button variant={ButtonVariant.Primary} onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
};
