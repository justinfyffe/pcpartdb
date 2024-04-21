'use client';

import { formatGameName, getGpuChipset } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import {
  closeDialog,
  showDialog,
} from 'packages/website/src/app/_common/components/Dialog/dialog';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { GameSelectionDialog } from 'packages/website/src/app/_common/game/components/GameSelection/GameSelectionDialog';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React, { useCallback, useMemo } from 'react';
import { usePageContext } from '../../../PageProvider';

const ValueIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetNameWithNoCompany}&apos;s cost per frame with
      similar {props.marketSegment} GPUs. This provides insight into which GPU
      gives the best bang for your buck. This data is based on the MSRP and FPS
      for{' '}
      <Button variant={ButtonVariant.Link} onClick={props.handleGameClick}>
        {props.selectedGameName}
      </Button>
      . Lower is better.
    </>
  ),
});

export const RelativeGameCpfIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  const { viewModel } = usePageContext();
  const chipset = getGpuChipset(viewModel.gpu);
  const { selectedGame, setSelectedGame } = useGameSelection();

  const games = useMemo(() => {
    return chipset?.games?.map((pg) => pg.game);
  }, [chipset]);
  const gameName = formatGameName(selectedGame);

  const handleGameClick = useCallback(() => {
    showDialog(
      <GameSelectionDialog
        games={games}
        onSelection={(game) => {
          setSelectedGame(game);
          closeDialog();
        }}
      />,
    );
  }, [games, setSelectedGame]);

  return (
    <ContentProvider
      tags={contentTags}
      params={{
        ...contentParams,
        selectedGameName: gameName,
        handleGameClick,
      }}
    >
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
