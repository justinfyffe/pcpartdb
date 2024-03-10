import { ProductType } from '@pcpartdb/shared';
import {
  TextInput,
  TextInputProps,
} from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { FunctionComponent, Ref, useContext, useMemo } from 'react';
import { Control } from 'react-hook-form';
import {
  ProductBenchmarksInput,
  ProductBenchmarksInputProps,
} from '../ProductBenchmarkInput/ProductBenchmarksInput';
import {
  ProductBooleanInput,
  ProductBooleanInputProps,
} from '../ProductBooleanInput/ProductBooleanInput';
import {
  ProductChipsInput,
  ProductChipsInputProps,
} from '../ProductChipsInput/ProductChipsInput';
import {
  ProductDateInput,
  ProductDateInputProps,
} from '../ProductDateInput/ProductDateInput';
import {
  ProductEnumInput,
  ProductEnumInputProps,
} from '../ProductEnumInput/ProductEnumInput';
import {
  ProductFloatInput,
  ProductFloatInputProps,
} from '../ProductFloatInput/ProductFloatInput';
import {
  ProductImagesInput,
  ProductImagesInputProps,
} from '../ProductImageInput/ProductImagesInput';
import {
  ProductOtherNamesInput,
  ProductOtherNamesInputProps,
} from '../ProductOtherNamesInput/ProductOtherNamesInput';
import {
  ProductParentInput,
  ProductParentInputProps,
} from '../ProductParentInput/ProductParentInput';
import {
  ProductSearchTextInput,
  ProductSearchTextInputProps,
} from '../ProductSearchTextInput/ProductSearchTextInput';
import {
  ProductSlugInput,
  ProductSlugInputProps,
} from '../ProductSlugInput/ProductSlugInput';
import {
  ProductSourcesInput,
  ProductSourcesInputProps,
} from '../ProductSourceInput/ProductSourcesInput';
import {
  ProductSummaryInput,
  ProductSummaryInputProps,
} from '../ProductSummaryInput/ProductSummaryInput';
import {
  ProductTextInput,
  ProductTextInputProps,
} from '../ProductTextInput/ProductTextInput';
import { ProductFormContext } from './ProductFormContext';
import { ProductFormInputConfig, ProductFormInputType } from './types';

interface ProductFormInputProps {
  productType: ProductType;
  config: ProductFormInputConfig;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: Ref<any>;
}

export const ProductFormInput: FunctionComponent<ProductFormInputProps> = (
  props,
) => {
  const { config, ...restOfProps } = props;
  const inputType = config.inputType;
  const context = useContext(ProductFormContext);

  // TODO: call overrides, overide the props/config with it.
  // memoize it
  const overrides = useMemo(() => {
    return config.overrides?.(context) ?? {};
  }, [config, context]);

  if (inputType === ProductFormInputType.Benchmarks) {
    return (
      <ProductBenchmarksInput
        {...(config as ProductBenchmarksInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.BooleanField) {
    return (
      <ProductBooleanInput
        {...(config as ProductBooleanInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.ChipsField) {
    return (
      <ProductChipsInput
        {...(config as ProductChipsInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.DateField) {
    return (
      <ProductDateInput
        {...(config as ProductDateInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.EnumField) {
    return (
      <ProductEnumInput
        {...(config as ProductEnumInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.FloatField) {
    return (
      <ProductFloatInput
        {...(config as ProductFloatInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.Images) {
    return (
      <ProductImagesInput
        {...(config as ProductImagesInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.OtherNames) {
    return (
      <ProductOtherNamesInput
        {...(config as ProductOtherNamesInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.Parent) {
    return (
      <ProductParentInput
        {...(config as ProductParentInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.SearchText) {
    return (
      <ProductSearchTextInput
        {...(config as ProductSearchTextInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.Slug) {
    return (
      <ProductSlugInput
        {...(config as ProductSlugInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.Sources) {
    return (
      <ProductSourcesInput
        {...(config as ProductSourcesInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.Summary) {
    return (
      <ProductSummaryInput
        {...(config as ProductSummaryInputProps)}
        {...restOfProps}
        {...overrides}
        {...context}
      />
    );
  } else if (inputType === ProductFormInputType.Text) {
    return (
      <TextInput
        {...(config as TextInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else if (inputType === ProductFormInputType.TextField) {
    return (
      <ProductTextInput
        {...(config as ProductTextInputProps)}
        {...restOfProps}
        {...overrides}
      />
    );
  } else {
    return <></>;
  }
};
