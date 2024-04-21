import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  CreateGameRequest,
  Game,
  GameRequirements,
  GameScraperOptions,
  GameSettings,
  Image,
  ImageManipulationPreset,
  ProductType,
  UpdateGameRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { gameService } from 'packages/website/src/client/game/services/gameService';
import { ProductAutocomplete } from 'packages/website/src/client/product/components/ProductAutocomplete/ProductAutocomplete';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
import { ErrorAlert } from 'packages/website/src/client/shared/components/Alert/ErrorAlert';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import {
  Field,
  FieldError,
  FieldOptional,
} from 'packages/website/src/client/shared/components/Field/Field';
import {
  Form,
  FormActions,
} from 'packages/website/src/client/shared/components/Form/Form';
import { DateInput } from 'packages/website/src/client/shared/components/Input/DateInput';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import { Spinner } from 'packages/website/src/client/shared/components/Spinner/Spinner';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../../../shared/error/utils';
import { ImageInput } from '../../image/ImageInput/ImageInput';
import { GameScraperOptionsInput } from '../GameScraperOptionsInput/GameScraperOptionsInput';
import { GameSettingsInput } from '../GameSettingsInput/GameSettingsInput';
import { GameSlugInput } from '../GameSlugInput/GameSlugInput';

interface GameFormData {
  name: string;
  slug: string;

  nameShort?: string;
  description?: string;
  publisher?: string;
  developer?: string;
  releaseDate?: string;
  affiliateUrl?: string;

  gameSettings?: GameSettings;
  scraperOptions?: GameScraperOptions;

  minimumRequirements?: GameRequirements;
  recommendedRequirements?: GameRequirements;

  minimumCpuId?: number;
  recommendedCpuId?: number;
  minimumGpuId?: number;
  recommendedGpuId?: number;

  listingImage?: Image;
}

const gameFormValidator = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),

  nameShort: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
  publisher: Joi.string().allow(null, ''),
  developer: Joi.string().allow(null, ''),
  releaseDate: Joi.string().allow(null, ''),
  affiliateUrl: Joi.string().allow(null, ''),

  gameSettings: Joi.any().allow(null),
  scraperOptions: Joi.any().allow(null),

  minimumRequirements: Joi.any().allow(null),
  recommendedRequirements: Joi.any().allow(null),

  minimumCpuId: Joi.number().allow(null),
  recommendedCpuId: Joi.number().allow(null),
  minimumGpuId: Joi.number().allow(null),
  recommendedGpuId: Joi.number().allow(null),

  listingImage: Joi.any().allow(null),
}).options({ abortEarly: false });

interface GameFormProps {
  game?: Partial<Game>;
  className?: string;

  redirectAfterSave?: boolean;
  onSave?: () => void;
}

const formOptions = (game?: Partial<Game>): UseFormProps<GameFormData> => ({
  resolver: joiResolver(gameFormValidator),
  mode: 'onBlur',
  defaultValues: {
    name: game?.name ?? '',
    slug: game?.slug ?? '',

    nameShort: game?.nameShort ?? '',
    description: game?.description ?? '',
    publisher: game?.publisher ?? '',
    developer: game?.developer ?? '',
    releaseDate: game?.releaseDate ?? '',
    affiliateUrl: game?.affiliateUrl ?? '',

    gameSettings: game?.gameSettings ?? null,
    scraperOptions: game?.scraperOptions ?? null,

    minimumRequirements: game?.minimumRequirements ?? null,
    recommendedRequirements: game?.recommendedRequirements ?? null,

    minimumCpuId: game?.minimumCpuId ?? null,
    recommendedCpuId: game?.recommendedCpuId ?? null,
    minimumGpuId: game?.minimumGpuId ?? null,
    recommendedGpuId: game?.recommendedGpuId ?? null,

    listingImage: game?.listingImage ?? null,
  },
});

export const GameForm: FunctionComponent<GameFormProps> = (props) => {
  const { game, redirectAfterSave, onSave } = props;
  const isUpdate = game?.id != null;
  useProductCache(ProductType.Cpu, game?.minimumCpu, game?.recommendedCpu);
  useProductCache(ProductType.Gpu, game?.minimumGpu, game?.recommendedGpu);

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const form = useMemo(() => formOptions(game), [game]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<GameFormData>(form);

  console.error(errors);

  const handleSave = useCallback(
    async (formData: GameFormData) => {
      setSaving(true);

      const request = convertFormDataToRequest(formData);

      try {
        if (isUpdate) {
          // TODO: convert formData to request
          await gameService.update(game.id, request);
        } else {
          // TODO: convert formData to request
          await gameService.create(request);
        }
        if (redirectAfterSave) {
          router.push('/admin/games');
        }
        onSave?.();
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setSaving(false);
      }
    },
    [game?.id, isUpdate, onSave, redirectAfterSave, router, setError],
  );

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await gameService.delete(game?.id);
      router.push('/admin/games');
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [game?.id, router, setError]);

  return (
    <Form onSubmit={handleSubmit(handleSave)} className={props.className}>
      {requestError && isBadRequestError(requestError) && (
        <ErrorAlert>Please fix the form errors and try again.</ErrorAlert>
      )}

      {requestError && !isBadRequestError(requestError) && (
        <ErrorAlert>
          An unknown error has occurred. Please try again later.
        </ErrorAlert>
      )}

      <Field>
        Name
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextInput {...field} ref={null} />}
        />
        {errors.name?.type === ValidationErrorType.MissingStringValue && (
          <FieldError>Required</FieldError>
        )}
      </Field>

      <Field>
        Slug
        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <GameSlugInput control={control} {...field} ref={null} />
          )}
        />
        {errors.slug?.type === ValidationErrorType.MissingStringValue && (
          <FieldError>Required</FieldError>
        )}
      </Field>

      <Field>
        Name (Shortened) <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="nameShort"
          control={control}
          render={({ field }) => <TextInput {...field} ref={null} />}
        />
      </Field>

      <Field>
        Description <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea {...field} ref={null} />}
        />
      </Field>

      <Field>
        Publisher <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="publisher"
          control={control}
          render={({ field }) => <TextInput {...field} ref={null} />}
        />
      </Field>

      <Field>
        Developer <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="developer"
          control={control}
          render={({ field }) => <TextInput {...field} ref={null} />}
        />
      </Field>

      <Field>
        Release Date <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="releaseDate"
          control={control}
          render={({ field }) => <DateInput {...field} ref={null} />}
        />
      </Field>

      <Field>
        Affiliate URL <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="affiliateUrl"
          control={control}
          render={({ field }) => <TextInput {...field} ref={null} />}
        />
      </Field>

      <Field>
        Minimum CPU Requirement, Product Link{' '}
        <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="minimumCpuId"
          control={control}
          render={({ field }) => (
            <ProductAutocomplete
              productType={ProductType.Cpu}
              {...field}
              ref={null}
            />
          )}
        />
      </Field>

      <Field>
        Recommended CPU Requirement, Product Link{' '}
        <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="recommendedCpuId"
          control={control}
          render={({ field }) => (
            <ProductAutocomplete
              productType={ProductType.Cpu}
              {...field}
              ref={null}
            />
          )}
        />
      </Field>

      <Field>
        Minimum GPU Requirement, Product Link{' '}
        <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="minimumGpuId"
          control={control}
          render={({ field }) => (
            <ProductAutocomplete
              productType={ProductType.Gpu}
              {...field}
              ref={null}
            />
          )}
        />
      </Field>

      <Field>
        Recommended GPU Requirement, Product Link{' '}
        <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="recommendedGpuId"
          control={control}
          render={({ field }) => (
            <ProductAutocomplete
              productType={ProductType.Gpu}
              {...field}
              ref={null}
            />
          )}
        />
      </Field>

      <Field>
        Listing Image <FieldOptional>(Optional)</FieldOptional>
        <Controller
          name="listingImage"
          control={control}
          render={({ field }) => (
            <ImageInput
              recommendedHeight={250}
              recommendedWidth={250}
              manipulation={ImageManipulationPreset.GameThumbnail}
              {...field}
              ref={null}
            />
          )}
        />
      </Field>

      <section>
        <h3>Game Settings</h3>
        <Controller
          name="gameSettings"
          control={control}
          render={({ field }) => <GameSettingsInput {...field} ref={null} />}
        />
      </section>

      <section>
        <h3>Scraper Options</h3>
        <Controller
          name="scraperOptions"
          control={control}
          render={({ field }) => (
            <GameScraperOptionsInput {...field} ref={null} />
          )}
        />
      </section>

      <FormActions>
        {isUpdate && (
          <WarningButton
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="mr-4"
          >
            {deleting && <Spinner />}
            <span>Delete</span>
          </WarningButton>
        )}

        <PrimaryButton type="submit" disabled={saving || deleting}>
          {saving && <Spinner />}
          <span>Save</span>
        </PrimaryButton>
      </FormActions>
    </Form>
  );
};

function convertFormDataToRequest(
  formData: GameFormData,
): CreateGameRequest | UpdateGameRequest {
  return {
    game: {
      name: formData.name,
      slug: formData.slug,

      nameShort: formData.nameShort,
      description: formData.description,
      publisher: formData.publisher,
      developer: formData.developer,
      releaseDate: formData.releaseDate,
      affiliateUrl: formData.affiliateUrl,

      gameSettings: formData.gameSettings,
      scraperOptions: formData.scraperOptions,

      minimumCpuId: formData.minimumCpuId,
      minimumGpuId: formData.minimumGpuId,
      recommendedCpuId: formData.recommendedCpuId,
      recommendedGpuId: formData.recommendedGpuId,
      minimumRequirements: formData.minimumRequirements,
      recommendedRequirements: formData.recommendedRequirements,

      listingImageId: formData.listingImage?.id,
    },
  };
}
