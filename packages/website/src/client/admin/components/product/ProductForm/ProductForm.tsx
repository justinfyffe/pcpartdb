import {
  ApiError,
  getAdminListProductsPath,
  Product,
  ProductBenchmark,
  ProductGame,
  ProductSource,
  ProductType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { productService } from 'packages/website/src/client/product/services/productService';
import {
  GameCache,
  useGameCache,
} from 'packages/website/src/client/shared/cache/GameCache';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
import { ErrorAlert } from 'packages/website/src/client/shared/components/Alert/ErrorAlert';
import { DangerButton } from 'packages/website/src/client/shared/components/Button/DangerButton';
import { InfoButton } from 'packages/website/src/client/shared/components/Button/InfoButton';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import { Field } from 'packages/website/src/client/shared/components/Field/Field';
import {
  Form,
  FormActions,
} from 'packages/website/src/client/shared/components/Form/Form';
import { Spinner } from 'packages/website/src/client/shared/components/Spinner/Spinner';
import {
  isBadRequestError,
  setValidationErrors,
} from 'packages/website/src/client/shared/error/utils';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrapedProduct } from '../../product/ScrapeProductDialog/types';
import { ScrapeProductDialog } from '../ScrapeProductDialog/ScrapeProductDialog';
import {
  FORM_DATA_TO_REQUEST,
  FORM_INPUTS,
  FORM_OPTIONS,
} from './forms/consts';
import {
  ProductFormContext,
  useProductFormContextBuilder,
} from './ProductFormContext';
import { ProductFormInput } from './ProductFormInput';

interface ProductFormProps {
  productType: ProductType;
  product?: Product;
}

export const ProductForm: FunctionComponent<ProductFormProps> = (props) => {
  const { productType, product } = props;

  const isUpdate = product != null;
  useProductCache(productType, product);
  useGameCache({ productGames: product?.games });

  const formInputs = FORM_INPUTS[productType];
  const formOptions = FORM_OPTIONS[productType];
  const formDataToRequest = FORM_DATA_TO_REQUEST[productType];

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const config = useMemo(() => formOptions(product), [formOptions, product]);
  const inputGroups = useMemo(() => formInputs(product), [formInputs, product]);
  const context = useProductFormContextBuilder(() => ({
    productType,
    product,
    parentProduct: product?.parent,
  }));

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm(config);

  console.log(errors);

  const handleSave = useCallback(
    async (formData: any) => {
      setSaving(true);

      const request = formDataToRequest(formData);

      try {
        if (isUpdate) {
          await productService.update(productType, product.id, request);
        } else {
          await productService.create(productType, request);
        }
        router.push(getAdminListProductsPath({ filter: { productType } }));
      } catch (err) {
        console.log(err);
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setSaving(false);
      }
    },
    [formDataToRequest, isUpdate, product?.id, productType, router, setError],
  );

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await productService.delete(product.id);
      router.push(getAdminListProductsPath({ filter: { productType } }));
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [product?.id, productType, router, setError]);

  const importSources = useWatch({
    control,
    name: ['sources'],
  });
  const parentIdSource = useWatch({
    control,
    name: ['parentId'],
  });

  const handleScrape = useCallback(
    (scraped: ScrapedProduct) => {
      const { data } = scraped;
      const name = data.name;
      const searchText = data.searchText;
      const otherNames = data.otherNames;
      const company = data.company;
      const fields = data.fields;

      // Name
      if (name.enabled) {
        setValue('name', name.value as string);
      }

      // Search Text
      if (searchText.enabled) {
        setValue('searchText', searchText.value as string);
      }

      // Other Names
      if (otherNames.enabled) {
        setValue('otherNames', otherNames.value as string[]);
      }

      // Company
      if (company.enabled) {
        setValue('company', company.value as string);
      }

      // Fields
      Object.keys(fields || {}).forEach((field) => {
        if (fields[field].enabled) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(field as any, fields[field].value);
        }
      });

      // Benchmarks
      const benchmarks = data.benchmarks;
      const scrapedBenchmarks = Object.keys(benchmarks || {})
        .filter((benchmark) => benchmarks[benchmark].enabled)
        .map((benchmark) => benchmarks[benchmark].value as ProductBenchmark);
      setValue('benchmarks', scrapedBenchmarks);

      // Games
      const games = data.games;
      const scrapedGames = Object.keys(games || {})
        .filter((gameId) => games[gameId].enabled)
        .map((gameId) => games[gameId].value as ProductGame);
      GameCache.save({ productGames: scrapedGames });
      setValue('games', scrapedGames);
    },
    [setValue],
  );

  const handleScrapeClick = useCallback(() => {
    const sources: Partial<ProductSource>[] = importSources?.[0] || [];
    if (parentIdSource?.[0]) {
      sources.push({ sourceProductId: parentIdSource[0] });
    }
    showDialog(
      <ScrapeProductDialog
        productType={productType}
        sources={sources}
        onImport={handleScrape}
      />,
      { disableClose: true },
    );
  }, [importSources, parentIdSource, productType, handleScrape]);

  return (
    <ProductFormContext.Provider value={context}>
      <Form onSubmit={handleSubmit(handleSave)}>
        {requestError && isBadRequestError(requestError) && (
          <ErrorAlert>Please fix the form errors and try again.</ErrorAlert>
        )}

        {requestError && !isBadRequestError(requestError) && (
          <ErrorAlert>
            An unknown error has occurred. Please try again later.
          </ErrorAlert>
        )}

        {inputGroups.map((inputGroup, i) => (
          <section key={i}>
            <div className="mb-4 flex items-center justify-between">
              {!!inputGroup.label && (
                <>
                  <h2 className="mb-0">{inputGroup.label}</h2>

                  {!!inputGroup.scraper && (
                    <InfoButton onClick={handleScrapeClick}>Scrape</InfoButton>
                  )}
                </>
              )}
            </div>

            {inputGroup.inputs.map((input) => (
              <Field key={input.name}>
                {!!input.fieldLabel && <span>{input.fieldLabel}</span>}
                <Controller
                  name={input.name}
                  control={control}
                  render={({ field }) => (
                    <ProductFormInput
                      {...field}
                      productType={productType}
                      config={input}
                      control={control}
                      ref={null}
                    />
                  )}
                />
              </Field>
            ))}
          </section>
        ))}

        <FormActions className={isUpdate ? 'justify-between' : 'justify-end'}>
          {isUpdate && (
            <DangerButton
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="mr-4"
            >
              {deleting && <Spinner />}
              <span>Delete</span>
            </DangerButton>
          )}

          <PrimaryButton type="submit" disabled={saving || deleting}>
            {saving && <Spinner />}
            {!saving && <span>Save</span>}
          </PrimaryButton>
        </FormActions>
      </Form>
    </ProductFormContext.Provider>
  );
};
