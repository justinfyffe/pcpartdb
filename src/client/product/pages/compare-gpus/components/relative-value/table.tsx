import { getGpuName, getViewGpuSlug } from '@client/product';
import { Table, TBody, Td, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ComparePageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const [product1, product2] = comparison;
  const { relativeValueGpus } = contentData;

  const [baselineProduct, setBaselineProduct] = useState(product1);
  const [secondaryProduct, setSecondaryProduct] = useState(product2);

  // Add nulls to rank gaps
  const gpus = useMemo(() => {
    const ret: Product[] = [];
    for (let i = 0; i < relativeValueGpus.length; ++i) {
      if (i > 0) {
        const rankDiff =
          relativeValueGpus[i].metas.valueRank.value -
          relativeValueGpus[i - 1].metas.valueRank.value;
        if (rankDiff > 1) {
          ret.push(null);
        }
      }
      ret.push(relativeValueGpus[i]);
    }
    return ret;
  }, [relativeValueGpus]);

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
          {gpus.map((gpu) =>
            gpu != null ? (
              <CustomRow
                key={gpu.id}
                highlight={gpu.id === baselineProduct.id}
                secondary={gpu.id === secondaryProduct.id}
              >
                <CustomRowLabel>
                  <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                    {getGpuName(gpu, { company: false })}
                  </a>
                </CustomRowLabel>
                <CustomRowValue className="text-left">
                  {getRelativePerformance(gpu)}%
                </CustomRowValue>
                <CustomRowValue className="text-left">
                  {formatProductMeta(gpu.metas?.valueRank)}
                </CustomRowValue>
              </CustomRow>
            ) : (
              <Tr>
                <Td colSpan={3} className="text-center">
                  &#8230;
                </Td>
              </Tr>
            ),
          )}
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
    return <span className="font-bold">{getGpuName(product)}</span>;
  } else {
    return (
      <a className="cursor-pointer" onClick={onClick}>
        {getGpuName(product)}
      </a>
    );
  }
};
