import {
  formatProductName,
  formatProductType,
  getAdminEditProductPath,
  Product,
} from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { AdminListProductsContext } from '../../context/AdminListProductsContext';

interface ListTableProps {
  //
}

export const ListTable: FunctionComponent<ListTableProps> = (_props) => {
  const { products } = useContext(AdminListProductsContext);

  return (
    <Table border responsive>
      <THead>
        <Tr className="font-medium">
          <Th className="text-center w-[1%] whitespace-nowrap min-w-16">ID</Th>
          <Th className="text-center text-center w-[1%] whitespace-nowrap min-w-16">
            Type
          </Th>
          <Th className="text-left">Name</Th>
        </Tr>
      </THead>
      <TBody>
        {products.map((product) => (
          <ListTableRow key={product.id} product={product} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  product: Product;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { product } = props;

  const type = useMemo(
    () => formatProductType(product.productType),
    [product.productType],
  );
  const href = useMemo(() => getAdminEditProductPath({ product }), [product]);
  const name = useMemo(() => formatProductName(product), [product]);

  return (
    <Tr key={product.id}>
      <Td className="text-center">{product.id}</Td>
      <Td className="text-center">{type}</Td>
      <Td>
        <a href={href}>{name}</a>
      </Td>
    </Tr>
  );
};
