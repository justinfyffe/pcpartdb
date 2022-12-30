import { productService } from '@client/product';
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
import { ImportProductResults } from '@shared/product';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImportName } from './import-name';
import { ImportProductContext } from './import-product-context';
import { ImportSpec } from './import-spec';

interface ImportProductDialogProps {
  url: string;
  onImport: (data: ImportProductResults) => void;
}

export const ImportProductDialog: FunctionComponent<
  ImportProductDialogProps
> = (props) => {
  const { url, onImport } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [dataToImport, setDataToImport] = useState<ImportProductResults>(null);

  useEffect(() => {
    async function importProduct() {
      const results = await productService.import({ url });
      setDataToImport(results);
      setLoading(false);
    }
    importProduct();
  }, [url]);

  const handleApply = useCallback(() => {
    onImport(dataToImport);
    closeDialog();
  }, [onImport, dataToImport]);

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
        <ImportProductContext.Provider value={dataToImport}>
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
              </TBody>
            </Table>
          </div>
        </ImportProductContext.Provider>
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
