import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName, Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ComparePageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../../custom-row';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const [product1, product2] = comparison;
  const { relativeValueGpus: gpus } = contentData;

  const [baselineProduct, setBaselineProduct] = useState(product1);
  const [secondaryProduct, setSecondaryProduct] = useState(product2);

  useEffect(() => {
    setBaselineProduct(product1);
    setSecondaryProduct(product2);
  }, [product1, product2]);

  const getRelativePerformance = useCallback(
    (relatedGpu: Product) => {
      const baseline = baselineProduct.benchmarks.valueScore.value;
      const relatedValue = relatedGpu.benchmarks.valueScore.value;

      return ((relatedValue / baseline) * 100).toFixed(0);
    },
    [baselineProduct],
  );

  const toggleBaselineProduct = useCallback(
    (product: Product) => {
      setSecondaryProduct(baselineProduct);
      setBaselineProduct(product);
    },
    [baselineProduct],
  );

  return (
    <>
      <div className="mb-1 text-right">
        Baseline:{' '}
        <BaselineToggle
          product={product1}
          active={baselineProduct.id === product1.id}
          onClick={() => toggleBaselineProduct(product1)}
        />{' '}
        or{' '}
        <BaselineToggle
          product={product2}
          active={baselineProduct.id === product2.id}
          onClick={() => toggleBaselineProduct(product2)}
        />
      </div>
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th></Th>
            <Th className="text-left">Relative Value</Th>
            <Th className="text-left">Rank</Th>
          </Tr>
        </THead>
        <TBody>
          {gpus.map((gpu) => (
            <CustomRow
              key={gpu.id}
              highlight={gpu.id === baselineProduct.id}
              secondary={gpu.id === secondaryProduct.id}
            >
              <CustomRowLabel>
                {getProductName(gpu, { company: false })}
              </CustomRowLabel>
              <CustomRowValue className="text-left">
                {getRelativePerformance(gpu)}%
              </CustomRowValue>
              <CustomRowValue className="text-left">
                {formatProductMeta(gpu.metas?.valueRank)}
              </CustomRowValue>
            </CustomRow>
          ))}
        </TBody>
      </Table>
    </>
  );
};

interface BaselineToggleProps {
  product: Product;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { product, active, onClick } = props;

  if (active) {
    return <span className="font-bold">{getProductName(product)}</span>;
  } else {
    return (
      <a className="cursor-pointer" onClick={onClick}>
        {getProductName(product)}
      </a>
    );
  }
};
