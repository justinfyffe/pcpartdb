import { ProductBenchmarksInputProps } from '../ProductBenchmarkInput/ProductBenchmarksInput';
import { ProductBooleanInputProps } from '../ProductBooleanInput/ProductBooleanInput';
import { ProductChipsInputProps } from '../ProductChipsInput/ProductChipsInput';
import { ProductDateInputProps } from '../ProductDateInput/ProductDateInput';
import { ProductEnumInputProps } from '../ProductEnumInput/ProductEnumInput';
import { ProductFloatInputProps } from '../ProductFloatInput/ProductFloatInput';
import { ProductImagesInputProps } from '../ProductImageInput/ProductImagesInput';
import { ProductOtherNamesInputProps } from '../ProductOtherNamesInput/ProductOtherNamesInput';
import { ProductParentInputProps } from '../ProductParentInput/ProductParentInput';
import { ProductSearchTextInputProps } from '../ProductSearchTextInput/ProductSearchTextInput';
import { ProductSlugInputProps } from '../ProductSlugInput/ProductSlugInput';
import { ProductSourcesInputProps } from '../ProductSourceInput/ProductSourcesInput';
import { ProductSummaryInputProps } from '../ProductSummaryInput/ProductSummaryInput';
import { ProductTextInputProps } from '../ProductTextInput/ProductTextInput';
import { ProductFormContextState } from './ProductFormContext';

export enum ProductFormInputType {
  Benchmarks = 'BENCHMARKS',
  BooleanField = 'BOOLEAN_FIELD',
  ChipsField = 'CHIPS_FIELD',
  DateField = 'DATE_FIELD',
  EnumField = 'ENUM_FIELD',
  FloatField = 'FLOAT_FIELD',
  Images = 'IMAGES',
  OtherNames = 'OTHER_NAMES',
  Parent = 'PARENT',
  SearchText = 'SEARCH_TEXT',
  Slug = 'SLUG',
  Sources = 'SOURCES',
  Summary = 'SUMMARY',
  Text = 'TEXT',
  TextField = 'TEXT_FIELD',
}

type InputProps =
  | Partial<ProductBenchmarksInputProps>
  | Partial<ProductBooleanInputProps>
  | Partial<ProductChipsInputProps>
  | Partial<ProductDateInputProps>
  | Partial<ProductEnumInputProps>
  | Partial<ProductFloatInputProps>
  | Partial<ProductImagesInputProps>
  | Partial<ProductOtherNamesInputProps>
  | Partial<ProductParentInputProps>
  | Partial<ProductSearchTextInputProps>
  | Partial<ProductSlugInputProps>
  | Partial<ProductSourcesInputProps>
  | Partial<ProductSummaryInputProps>
  | Partial<ProductTextInputProps>;

export type ProductFormInputConfig = InputProps & {
  name: string;
  inputType: ProductFormInputType;
  fieldLabel?: string;

  overrides?: (ctx: ProductFormContextState) => Record<string, any>;
};

export interface ProductFormInputGroup {
  label?: string;
  scraper?: boolean;
  inputs: ProductFormInputConfig[];
}

export type ProductFormInputGroups = ProductFormInputGroup[];
