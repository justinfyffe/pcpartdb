import { Game, ProductGameFps } from '@pcpartdb/shared';
import { NumberInput } from 'packages/website/src/client/shared/components/Input/NumberInput';
import React, { useCallback } from 'react';

export interface ProductGameFpsInputProps {
  game: Partial<Game>;
  value: ProductGameFps;

  onChange: (value: ProductGameFps) => void;
}

export function ProductGameFpsInput(props: ProductGameFpsInputProps) {
  const { game, value, onChange } = props;
  const { settingsPresetKey } = value;

  const label =
    game?.gameSettings?.presets?.[settingsPresetKey]?.nameShort ||
    game?.gameSettings?.presets?.[settingsPresetKey]?.name;

  const handleFpsChange = useCallback(
    (fps: number) => {
      const newValue: ProductGameFps = {
        gameId: game?.id,
        settingsPresetKey,
        fps,
      };
      onChange(newValue);
    },
    [game?.id, onChange, settingsPresetKey],
  );

  if (label == null) {
    return <></>;
  }

  return (
    <div className="flex flex-1 flex-col gap-1">
      {label}
      <NumberInput value={value?.fps} onChange={handleFpsChange} />
    </div>
  );
}
