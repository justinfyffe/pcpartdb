import 'reflect-metadata';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  AutomationSource,
  formatAutomationSourceName,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { AutomationSourceAutocomplete } from 'packages/website/src/client/product/components/AutomationSourceAutocomplete/AutomationSourceAutocomplete';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import {
  Field,
  FieldHint,
  FieldOptional,
} from 'packages/website/src/client/shared/components/Field/Field';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { useCallback, useMemo } from 'react';
import { SourcePickerDialog } from '../SourcePickerDialog';

interface SourceInputFieldProps {
  productType: ProductType;
  sourceKey: ProductSourceKey;
  sources: AutomationSource[];
  currentSource?: AutomationSource;
  sourceDisabled?: boolean;

  onUseName?: (name: string) => void;
  onChange?: (source: AutomationSource) => void;
}

export const SourceInputField = (props: SourceInputFieldProps) => {
  const {
    productType,
    sourceKey,
    sources,
    currentSource,
    sourceDisabled,
    onUseName,
    onChange,
  } = props;

  // Memos

  const sourceKeyName = useMemo(
    () => formatAutomationSourceName(sourceKey),
    [sourceKey],
  );

  // Callbacks

  const showSourcePickerDialog = useCallback(
    (sources: AutomationSource[], currentSource: AutomationSource) => {
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
        productType: productType as ProductType.Cpu | ProductType.Gpu,
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
        <AutomationSourceAutocomplete
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
        </div>
      )}
    </Field>
  );
};
