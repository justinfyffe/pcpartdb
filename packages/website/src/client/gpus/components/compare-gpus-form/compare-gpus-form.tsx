import { GpuComparison } from '@pcpartdb/shared';
import React, {
  FormEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { getCompareGpusSlug, getViewGpuSlug } from '../../../gpus';
import { GpuCache } from '../../../shared/cache';
import { Button, ButtonVariant, Form } from '../../../shared/components';
import { classNames } from '../../../shared/ui';
import { getCompareGpusPath, getViewGpuPath } from '../../../shared/website';
import { GpuAutocomplete } from '../gpu-autocomplete';

interface CompareGpusFormProps {
  className?: string;

  values?: number[];
}

export const CompareGpusForm: FunctionComponent<CompareGpusFormProps> = (
  props,
) => {
  const { className } = props;

  const [values, setValues] = useState(props.values ?? [null, null]);

  const filteredValues = useMemo(
    () => values.filter((value) => value != null),
    [values],
  );

  const onGpuChange = useCallback(
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

      const gpus = values
        .filter((value) => value != null)
        .map((value) => GpuCache.get(value));

      if (gpus.length === 2 && gpus[0].id !== gpus[1].id) {
        window.location.href = getCompareGpusPath(
          getCompareGpusSlug(gpus as GpuComparison),
        );
        return;
      } else if (gpus.length === 1 || gpus[0].id === gpus[1].id) {
        window.location.href = getViewGpuPath(getViewGpuSlug(gpus[0]));
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
        <GpuAutocomplete
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onGpuChange(0, value)}
          value={values[0]}
        />

        <div
          className={classNames(
            'font-medium self-center row-span-2 text-center w-12.5',
          )}
        >
          VS
        </div>

        <GpuAutocomplete
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onGpuChange(1, value)}
          value={values[1]}
        />
      </div>

      <Button
        type="submit"
        variant={ButtonVariant.Primary}
        disabled={filteredValues.length === 0}
        className="min-w-25"
      >
        {filteredValues.length === 1 ? 'View' : 'Compare'}
      </Button>
    </Form>
  );
};
