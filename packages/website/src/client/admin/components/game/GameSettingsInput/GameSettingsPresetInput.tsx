import { GameSettingsPreset, SettingsPresetKey } from '@pcpartdb/shared';
import {
  Field,
  FieldOptional,
} from 'packages/website/src/client/shared/components/Field/Field';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { FunctionComponent, useCallback, useMemo } from 'react';

export interface GameSettingsPresetInputProps {
  preset: SettingsPresetKey;
  value: GameSettingsPreset;
  onChange: (value: GameSettingsPreset) => void;
  ref?: unknown;
}

export const GameSettingsPresetInput: FunctionComponent<
  GameSettingsPresetInputProps
> = (props) => {
  const { preset, value, onChange } = props;

  const presetName = useMemo(() => {
    switch (preset) {
      case SettingsPresetKey.Low:
        return 'Low';
      case SettingsPresetKey.Medium:
        return 'Medium';
      case SettingsPresetKey.High:
        return 'High';
      case SettingsPresetKey.Ultra:
        return 'Ultra';
      case SettingsPresetKey.QHD:
        return 'QHD';
      case SettingsPresetKey._4K_UHD:
        return '4K';
      default:
        return 'Unknown';
    }
  }, [preset]);

  const handleNameChange = useCallback(
    (name: string) => {
      const newValue = { ...(value ?? {}), name };
      onChange(newValue);
    },
    [onChange, value],
  );

  const handleNameShortChange = useCallback(
    (nameShort: string) => {
      const newValue = { ...(value ?? {}), nameShort };
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className="flex gap-x-4 mb-6 items-center">
      <div className="w-20">{presetName}</div>
      <Field className="flex-1">
        Name <FieldOptional>(Optional)</FieldOptional>
        <TextInput value={value?.name} onChange={handleNameChange} />
      </Field>

      <Field className="flex-1">
        Name, Shortened <FieldOptional>(Optional)</FieldOptional>
        <TextInput value={value?.nameShort} onChange={handleNameShortChange} />
      </Field>
    </div>
  );
};
