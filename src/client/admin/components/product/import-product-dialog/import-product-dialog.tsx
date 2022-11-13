import { productService } from '@client/product';
import {
  Button,
  ButtonVariant,
  Checkbox,
  closeDialog,
  Spinner,
  Table,
  TBody,
  Td,
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

interface ImportProductDialogProps {
  url: string;
}

export const ImportProductDialog: FunctionComponent<
  ImportProductDialogProps
> = (props) => {
  const { url } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [results, setResults] = useState<ImportProductResults>(null);

  useEffect(() => {
    async function importProduct() {
      const results = await productService.import({ url });
      setResults(results);
      setLoading(false);
    }
    importProduct();
  }, [url]);

  const handleCancel = useCallback(() => {
    closeDialog();
  }, []);

  return (
    <div className="bg-white flex flex-col h-[80%] w-[80%] p-4 overflow-auto max-w-[990px] rounded shadow">
      {loading && (
        <div className="flex flex-col items-center justify-center h-full w-full gap-6">
          <Spinner className="w-24 h-24 border-[12px]" />
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-center">Importing data.</h3>
            <div className="text-lg">This may take a moment.</div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="flex-1">
          <Table>
            <THead>
              <Tr>
                <Th>Spec</Th>
                <Th>Value</Th>
                <Th className="text-right">Import?</Th>
              </Tr>
            </THead>
            <TBody>
              {results.specs?.architecture?.value != null && (
                <Tr onClick={null} className="hover:bg-gray-200 cursor-pointer">
                  <Td>Architecture</Td>
                  <Td>{results.specs.architecture.value}</Td>
                  <Td className="text-right">
                    <Checkbox />
                  </Td>
                </Tr>
              )}
              {results.specs?.busInterface?.value != null && (
                <Tr onClick={null} className="hover:bg-gray-200 cursor-pointer">
                  <Td>Bus Interface</Td>
                  <Td>{results.specs.busInterface.value}</Td>
                  <Td className="text-right">
                    <Checkbox />
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant={ButtonVariant.Default} onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant={ButtonVariant.Primary} disabled>
          Apply
        </Button>
      </div>
    </div>
  );
};
