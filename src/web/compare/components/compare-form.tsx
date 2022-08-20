import { PlusCircleIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Input } from '../../shared/components/input';
import { classNames } from '../../shared/ui/ui.utils';

interface CompareFormProps {
  className?: string;

  values?: number[];
}

export const CompareForm: FunctionComponent<CompareFormProps> = (props) => {
  const { className } = props;

  const [values, setValues] = useState(props.values ?? []);

  const onAdd = useCallback(() => {
    setValues([...values, 0]);
  }, [values]);

  const onDelete = useCallback(() => {
    setValues(values.slice(1));
  }, [values]);

  return (
    <section
      className={classNames(
        'flex flex-col gap-4 w-full',
        values.length > 2 ? 'lg:flex-row' : 'md:flex-row',
        className,
      )}
    >
      <div
        className={classNames(
          'flex-1 gap-4 grid grid-cols-[1fr_auto]',
          values.length > 2
            ? 'lg:flex'
            : values.length > 1
            ? 'md:flex'
            : 'flex',
        )}
      >
        <Input
          placeholder="Graphics Card..."
          value="NVIDIA GeForce RTX 3090"
          clearable={values.length > 1}
          className={classNames('flex-1 min-w-[150px]')}
          onClear={onDelete}
        />

        {values.length > 1 && (
          <>
            <div
              className={classNames(
                'font-medium self-center text-center w-[50px]',
              )}
            >
              VS
            </div>

            <Input
              placeholder="Graphics Card..."
              value="NVIDIA GeForce RTX 3080"
              clearable
              className={classNames('flex-1 min-w-[150px]')}
              onClear={onDelete}
            />
          </>
        )}

        {values.length > 2 && (
          <>
            <div
              className={classNames(
                'font-medium self-center text-center w-[50px]',
              )}
            >
              VS
            </div>

            <Input
              placeholder="Graphics Card..."
              value="NVIDIA GeForce RTX 3080"
              clearable
              className={classNames('flex-1 min-w-[150px]')}
              onClear={onDelete}
            />
          </>
        )}

        <Button
          disabled={values.length === 3}
          variant={ButtonVariant.Default}
          className={classNames('flex-none px-0 py-0 w-[50px]')}
          onClick={onAdd}
        >
          <PlusCircleIcon className={classNames('h-[24px] mx-auto')} />
        </Button>
      </div>

      <Button variant={ButtonVariant.Primary} className="min-w-[100px]">
        {values.length > 1 ? 'Compare' : 'Search'}
      </Button>
    </section>
  );
};
