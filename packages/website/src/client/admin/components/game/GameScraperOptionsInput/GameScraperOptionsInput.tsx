import { GameScraperOptions } from '@pcpartdb/shared';
import {
  Field,
  FieldOptional,
} from 'packages/website/src/client/shared/components/Field/Field';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { FunctionComponent, useCallback } from 'react';

export interface GameScraperOptionsInputProps {
  value: GameScraperOptions;
  onChange: (value: GameScraperOptions) => void;
  ref?: unknown;
}

export const GameScraperOptionsInput: FunctionComponent<
  GameScraperOptionsInputProps
> = (props) => {
  const { value, onChange } = props;

  const handleNotebookCheckNameChange = useCallback(
    (notebookCheckName: string) => {
      const newValue = { ...(value ?? {}), notebookCheckName };
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      <Field>
        Game Name on Notebookcheck <FieldOptional>(Optional)</FieldOptional>
        <TextInput
          value={value?.notebookCheckName}
          onChange={handleNotebookCheckNameChange}
        />
      </Field>
    </div>
  );
};
