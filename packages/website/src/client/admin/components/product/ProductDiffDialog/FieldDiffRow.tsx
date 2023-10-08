import {
  compareProductFields,
  getProductFieldLabel,
  ProductDiff,
  ProductField,
  productFieldFormattedValue,
  ProductFieldKey,
  productFieldRawValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useMemo } from 'react';

interface FieldDiffRowProps {
  productType: ProductType;
  diffFieldKey: ProductFieldKey;
  diff: ProductDiff;
}

export const FieldDiffRow: FunctionComponent<FieldDiffRowProps> = (props) => {
  const { productType, diffFieldKey, diff } = props;

  const { original, updated } = diff;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const before = (original?.fields as any)?.[diffFieldKey];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const after = (updated?.fields as any)?.[diffFieldKey];

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
      compareProductFields(before as ProductField, after as ProductField) !==
        0 ||
      productFieldFormattedValue(before) !== productFieldFormattedValue(after)
    );
  }, [after, before]);

  const label = useMemo(() => {
    return getProductFieldLabel(productType, diffFieldKey);
  }, [productType, diffFieldKey]);

  const beforeRawText = useMemo(() => {
    if (before == null) {
      return '--';
    }

    if (typeof before === 'number' || typeof before === 'string') {
      return `${before}`;
    }
    return `${productFieldRawValue(before) ?? '--'}`;
  }, [before]);

  const afterRawText = useMemo(() => {
    if (after == null) {
      return '--';
    }

    if (typeof after === 'number' || typeof after === 'string') {
      return `${after}`;
    }
    return `${productFieldRawValue(after) ?? '--'}`;
  }, [after]);

  const beforeFormattedText = useMemo(() => {
    if (before == null) {
      return '--';
    }

    if (typeof before === 'number' || typeof before === 'string') {
      return `${before}`;
    }
    return productFieldFormattedValue(before) ?? '--';
  }, [before]);

  const afterFormattedText = useMemo(() => {
    if (after == null) {
      return '--';
    }

    if (typeof after === 'number' || typeof after === 'string') {
      return `${after}`;
    }
    return productFieldFormattedValue(after) ?? '--';
  }, [after]);

  return (
    <Tr>
      <Td
        className={classNames('border-r-px', hasChange ? 'bg-yellow-100' : '')}
      >
        {label}
      </Td>
      <Td className={hasChange ? 'bg-yellow-100' : ''}>{beforeRawText}</Td>
      <Td
        className={classNames('border-r-px', hasChange ? 'bg-yellow-100' : '')}
      >
        {beforeFormattedText}
      </Td>
      <Td className={hasChange ? 'bg-yellow-100' : ''}>{afterRawText}</Td>
      <Td className={hasChange ? 'bg-yellow-100' : ''}>{afterFormattedText}</Td>
    </Tr>
  );
};
