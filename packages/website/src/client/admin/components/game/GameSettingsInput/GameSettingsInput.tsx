import {
  GameSettings,
  GameSettingsPreset,
  SettingsPresetKey,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback } from 'react';
import { GameSettingsPresetInput } from './GameSettingsPresetInput';

export interface GameSettingsInputProps {
  value: GameSettings;
  onChange: (value: GameSettings) => void;
  ref?: unknown;
}

export const GameSettingsInput: FunctionComponent<GameSettingsInputProps> = (
  props,
) => {
  const { value, onChange } = props;

  const handlePresetChange = useCallback(
    (preset: SettingsPresetKey, presetValue: GameSettingsPreset) => {
      const newValue: GameSettings = { ...(value ?? { presets: {} }) };
      newValue.presets[preset] = presetValue;
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      <GameSettingsPresetInput
        preset={SettingsPresetKey.Low}
        value={value?.presets?.[SettingsPresetKey.Low]}
        onChange={(presetValue) =>
          handlePresetChange(SettingsPresetKey.Low, presetValue)
        }
      />
      <GameSettingsPresetInput
        preset={SettingsPresetKey.Medium}
        value={value?.presets?.[SettingsPresetKey.Medium]}
        onChange={(presetValue) =>
          handlePresetChange(SettingsPresetKey.Medium, presetValue)
        }
      />
      <GameSettingsPresetInput
        preset={SettingsPresetKey.High}
        value={value?.presets?.[SettingsPresetKey.High]}
        onChange={(presetValue) =>
          handlePresetChange(SettingsPresetKey.High, presetValue)
        }
      />
      <GameSettingsPresetInput
        preset={SettingsPresetKey.Ultra}
        value={value?.presets?.[SettingsPresetKey.Ultra]}
        onChange={(presetValue) =>
          handlePresetChange(SettingsPresetKey.Ultra, presetValue)
        }
      />
      <GameSettingsPresetInput
        preset={SettingsPresetKey.QHD}
        value={value?.presets?.[SettingsPresetKey.QHD]}
        onChange={(presetValue) =>
          handlePresetChange(SettingsPresetKey.QHD, presetValue)
        }
      />
      <GameSettingsPresetInput
        preset={SettingsPresetKey._4K_UHD}
        value={value?.presets?.[SettingsPresetKey._4K_UHD]}
        onChange={(presetValue) =>
          handlePresetChange(SettingsPresetKey._4K_UHD, presetValue)
        }
      />
    </div>
  );
};
