import { Button } from '@client/shared/components';
import { Input } from '@client/shared/components/input/input';
import { Spec } from '@shared/spec';
import React, { forwardRef, useCallback, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';

interface SlugFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;

  value?: string;
  onChange?: (value: string) => void;
}

export const SlugField = forwardRef<HTMLInputElement, SlugFieldProps>(
  (props, ref) => {
    const { control, onChange, value } = props;

    const name: string = useWatch({ control, name: 'name' });
    const company: Spec<string> = useWatch({ control, name: 'company' });
    const [slug, setSlug] = useState(value);

    const handleGenerate = useCallback(() => {
      const parts = [];
      if (company?.value != null) {
        const companyParts = company.value
          .split(' ')
          .map((value) => value.toLowerCase());
        parts.push(...companyParts);
      }
      if (name != null) {
        const nameParts = name.split(' ').map((value) => value.toLowerCase());
        parts.push(...nameParts);
      }

      const value = parts.join('-');
      setSlug(value);
      onChange?.(value);
    }, [onChange, name, company]);

    return (
      <Input
        type="string"
        value={slug || ''}
        ref={ref}
        suffix={<Button onClick={handleGenerate}>Generate</Button>}
      />
    );
  },
);
SlugField.displayName = 'SlugField';
