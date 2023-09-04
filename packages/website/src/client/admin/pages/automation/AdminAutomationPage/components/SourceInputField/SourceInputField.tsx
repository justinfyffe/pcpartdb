import 'reflect-metadata';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  formatProductSourceName,
  ProductSource,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { ProductSourceAutocomplete } from 'packages/website/src/client/product/components/ProductSourceAutocomplete';
import {
  Checkbox,
  showDialog,
  TextInput,
} from 'packages/website/src/client/shared/components';
import {
  Field,
  FieldHint,
  FieldOptional,
} from 'packages/website/src/client/shared/components/Field/Field';
import React, { useCallback, useMemo } from 'react';
import { SourcePickerDialog } from '../SourcePickerDialog';

interface SourceInputFieldProps {
  productType: ProductType;
  sourceKey: ProductSourceKey;
  sources: ProductSource[];
  currentSource?: ProductSource;
  sourceDisabled?: boolean;

  archive?: boolean;
  setArchive?: (archive: boolean) => void;

  onUseName?: (name: string) => void;
  onChange?: (source: ProductSource) => void;
}

export const SourceInputField = (props: SourceInputFieldProps) => {
  const {
    productType,
    sourceKey,
    sources,
    currentSource,
    sourceDisabled,
    archive,
    setArchive,
    onUseName,
    onChange,
  } = props;

  // Memos

  const sourceKeyName = useMemo(
    () => formatProductSourceName(sourceKey),
    [sourceKey],
  );

  // Callbacks

  const showSourcePickerDialog = useCallback(
    (sources: ProductSource[], currentSource: ProductSource) => {
      if (sources.length === 0) {
        return;
      }

      showDialog(
        <SourcePickerDialog
          currentSource={currentSource}
          sources={sources}
          onSelected={(selected) => onChange?.(selected)}
        />,
      );
    },
    [onChange],
  );

  const handleUrlChange = useCallback(
    (url: string) => {
      onChange?.({
        productType,
        sourceKey,
        sourceUrl: url,
        groupKey: '',
        externalKey: '',
        sourceName: '',
      });
    },
    [onChange, productType, sourceKey],
  );

  // Render

  return (
    <Field className="flex-1">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div>
            {sourceKeyName}{' '}
            {sources.length > 1 ? <>(x{sources.length})</> : <></>}
          </div>
          {currentSource != null && (
            <a
              href={currentSource.sourceUrl}
              target="_blank"
              rel="noreferrer nofollow"
            >
              <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
            </a>
          )}
        </div>

        <FieldOptional className="flex gap-2">
          {sources.length > 0 && (
            <>
              <a
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  showSourcePickerDialog(sources, currentSource);
                }}
              >
                picker
              </a>

              {currentSource != null && <>&bull;</>}
            </>
          )}
          {currentSource?.sourceName && (
            <a
              onClick={(e) => {
                e.preventDefault();
                onUseName?.(currentSource.sourceName);
              }}
              className="cursor-pointer"
            >
              use name
            </a>
          )}
        </FieldOptional>
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <ProductSourceAutocomplete
          productType={productType}
          source={sourceKey}
          value={currentSource}
          onChange={onChange}
          disabled={sourceDisabled}
        />
        <TextInput
          value={currentSource?.sourceUrl}
          disabled={currentSource?.id != null}
          onChange={handleUrlChange}
        />
      </div>
      {currentSource?.id != null && (
        <div className="flex justify-between">
          <FieldHint>
            {currentSource.id} (
            {currentSource.archived ? <>Archived</> : <>Not Archived</>})
          </FieldHint>
          <Checkbox value={archive} onChange={setArchive}>
            Archive
          </Checkbox>
        </div>
      )}
    </Field>
  );
};
