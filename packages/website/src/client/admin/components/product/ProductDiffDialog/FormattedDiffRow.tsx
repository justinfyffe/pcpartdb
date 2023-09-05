import {
  BooleanFormatter,
  compareProductFields,
  formatProductField,
  getProductFieldLabel,
  ProductDiff,
  ProductField,
  ProductType,
} from '@pcpartdb/shared';
import { Td, Tr } from 'packages/website/src/client/shared/components';
import React, { FunctionComponent, useMemo } from 'react';
import { ProductDiffKey } from './types';

interface FormattedDiffRowProps {
  productType: ProductType;
  diffFieldKey: ProductDiffKey;
  diff: ProductDiff;
}

export const FormattedDiffRow: FunctionComponent<FormattedDiffRowProps> = (
  props,
) => {
  const { productType, diffFieldKey, diff } = props;

  const { original, updated } = diff;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const before = (original as any)?.[diffFieldKey];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const after = (updated as any)?.[diffFieldKey];

  const hasChange = useMemo(() => {
    if (before == null || after == null) {
      return before !== after;
    }

    if (typeof before === 'number' && typeof after === 'number') {
      return before !== after;
    }

    if (typeof before === 'string' && typeof after === 'string') {
      return before !== after;
    }

    return (
      compareProductFields(before as ProductField, after as ProductField) !== 0
    );
  }, [after, before]);

  const label = useMemo(() => {
    if (diffFieldKey === 'name') {
      return 'Name';
    } else if (diffFieldKey === 'slug') {
      return 'Slug';
    } else {
      return getProductFieldLabel(productType, diffFieldKey);
    }
  }, [productType, diffFieldKey]);

  const beforeText = useMemo(() => {
    if (before == null) {
      return '--';
    }

    if (typeof before === 'number' || typeof before === 'string') {
      return `${before}`;
    }
    return (
      formatProductField(productType, before, {
        booleanFormatter: BooleanFormatter.YesNo,
      }) || '--'
    );
  }, [before, productType]);

  const afterText = useMemo(() => {
    if (after == null) {
      return '--';
    }

    if (typeof after === 'number' || typeof after === 'string') {
      return `${after}`;
    }
    return (
      formatProductField(productType, after, {
        booleanFormatter: BooleanFormatter.YesNo,
      }) || '--'
    );
  }, [after, productType]);

  return (
    <Tr>
      <Td className={hasChange ? 'bg-yellow-100' : ''}>{label}</Td>
      <Td className={hasChange ? 'bg-yellow-100' : ''}>{beforeText}</Td>
      <Td className={hasChange ? 'bg-yellow-100' : ''}>{afterText}</Td>
    </Tr>
  );
};
