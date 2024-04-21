import {
  getProductGame,
  getProductGameFpsValue,
  ProductDiff,
  SETTINGS_PRESETS_ORDER,
} from '@pcpartdb/shared';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useMemo } from 'react';

interface ProductGameDiffRowProps {
  diff: ProductDiff;
  diffGameId: number;
}

export const ProductGameDiffRow: FunctionComponent<ProductGameDiffRowProps> = (
  props,
) => {
  const { diffGameId, diff } = props;

  const { original, updated } = diff;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const before = getProductGame(original, diffGameId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const after = getProductGame(updated, diffGameId);

  const hasChange = useMemo(() => {
    if (before == null || after == null) {
      return before !== after;
    }

    for (const preset of SETTINGS_PRESETS_ORDER) {
      const beforeFps = getProductGameFpsValue(before, preset);
      const afterFps = getProductGameFpsValue(after, preset);
      if (beforeFps !== afterFps) {
        return true;
      }
    }

    return false;
  }, [after, before]);

  const label = useMemo(() => {
    return (before?.game?.name || after?.game?.name) ?? 'Unknown Game';
  }, [before, after]);

  const beforeText = useMemo(() => {
    if (before == null) {
      return '--';
    }

    const fps = before?.fps?.map(
      (val) => `${val.settingsPresetKey}: ${val.fps}`,
    );
    return `${fps.join(', ') ?? '--'}`;
  }, [before]);

  const afterText = useMemo(() => {
    if (after == null) {
      return '--';
    }

    const fps = after?.fps?.map(
      (val) => `${val.settingsPresetKey}: ${val.fps}`,
    );
    return `${fps.join(', ') ?? '--'}`;
  }, [after]);

  return (
    <Tr>
      <Td
        className={classNames('border-r-px', hasChange ? 'bg-yellow-100' : '')}
      >
        {label}
      </Td>
      <Td
        className={classNames('border-r-px', hasChange ? 'bg-yellow-100' : '')}
        colSpan={2}
      >
        {beforeText}
      </Td>
      <Td className={hasChange ? 'bg-yellow-100' : ''} colSpan={2}>
        {afterText}
      </Td>
    </Tr>
  );
};
