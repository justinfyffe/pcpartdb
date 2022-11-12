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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function importProduct() {
      await productService.import({ url });
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
              <Tr onClick={null} className="hover:bg-gray-200 cursor-pointer">
                <Td>Company</Td>
                <Td>NVIDIA</Td>
                <Td className="text-right">
                  <Checkbox />
                </Td>
              </Tr>
              <Tr onClick={null} className="hover:bg-gray-200 cursor-pointer">
                <Td>Market Segment</Td>
                <Td>Desktop</Td>
                <Td className="text-right">
                  <Checkbox />
                </Td>
              </Tr>
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
