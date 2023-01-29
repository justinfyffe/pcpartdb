import { Button } from '@client/shared/components';
import { Input } from '@client/shared/components/input/input';
import { GpuSpec } from '@shared/gpus';
import React, { forwardRef, useCallback, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';

interface GpuSlugFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;

  value?: string;
  onChange?: (value: string) => void;
}

export const GpuSlugField = forwardRef<HTMLInputElement, GpuSlugFieldProps>(
  (props, ref) => {
    const { control, onChange, value } = props;

    const name: string = useWatch({ control, name: 'name' });
    const company: GpuSpec<string> = useWatch({ control, name: 'company' });
    const [slug, setSlug] = useState(value);

    const handleChange = useCallback(
      (value: string) => {
        setSlug(value);
        onChange?.(value);
      },
      [onChange],
    );

    const handleGenerate = useCallback(() => {
      const slugParts = [];
      if (company?.value != null) {
        const companyParts = company.value
          .split(' ')
          .map((value) => value.toLowerCase());
        slugParts.push(...companyParts);
      }
      if (name != null) {
        const nameParts = name.split(' ').map((value) => value.toLowerCase());
        slugParts.push(...nameParts);
      }

      const value = slugParts.join('-');
      setSlug(value);
      onChange?.(value);
    }, [onChange, name, company]);

    return (
      <Input
        type="string"
        value={slug || ''}
        onChange={handleChange}
        ref={ref}
        suffix={<Button onClick={handleGenerate}>Generate</Button>}
      />
    );
  },
);
GpuSlugField.displayName = 'SlugField';
