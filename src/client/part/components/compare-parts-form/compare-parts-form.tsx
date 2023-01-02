import { getCompareGpusSlug, getViewGpuSlug } from '@client/part/part-utils';
import { PartCache } from '@client/shared/cache';
import { Button, ButtonVariant, Form } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { getCompareGpusPath, getViewGpuPath } from '@client/shared/website';
import { PartComparison, PartType } from '@shared/part';
import React, {
  FormEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { PartAutocomplete } from '../part-autocomplete';

interface ComparePartsFormProps {
  className?: string;

  values?: number[];
}

export const ComparePartsForm: FunctionComponent<ComparePartsFormProps> = (
  props,
) => {
  const { className } = props;

  const [values, setValues] = useState(props.values ?? [null, null]);

  const filteredValues = useMemo(
    () => values.filter((value) => value != null),
    [values],
  );

  const onPartChange = useCallback(
    (i: number, value: number) => {
      const newValues = [...values];
      newValues[i] = value;
      setValues(newValues);
    },
    [values],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const parts = values
        .filter((value) => value != null)
        .map((value) => PartCache.get(value));

      if (parts.length === 2 && parts[0].id !== parts[1].id) {
        window.location.href = getCompareGpusPath(
          getCompareGpusSlug(parts as PartComparison),
        );
        return;
      } else if (parts.length === 1 || parts[0].id === parts[1].id) {
        window.location.href = getViewGpuPath(getViewGpuSlug(parts[0]));
        return;
      } else {
        return;
      }
    },
    [values],
  );

  return (
    <Form
      onSubmit={handleSubmit}
      className={classNames(
        'flex flex-row gap-4 w-full',
        'md:flex-col',
        className,
      )}
    >
      <div
        className={classNames('flex flex-1 gap-4 md:grid grid-cols-[1fr_auto]')}
      >
        <PartAutocomplete
          partType={PartType.GPU}
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onPartChange(0, value)}
          value={values[0]}
        />

        <div
          className={classNames(
            'font-medium self-center row-span-2 text-center w-12.5',
          )}
        >
          VS
        </div>

        <PartAutocomplete
          partType={PartType.GPU}
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onPartChange(1, value)}
          value={values[1]}
        />
      </div>

      <Button
        type="submit"
        variant={ButtonVariant.Primary}
        disabled={filteredValues.length === 0}
        className="min-w-25"
      >
        {filteredValues.length === 1 ? 'Search' : 'Compare'}
      </Button>
    </Form>
  );
};
