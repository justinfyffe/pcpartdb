'use client';

import {
  formatGameName,
  formatProductName,
  getGamesFromProducts,
  getGpuChipset,
} from '@pcpartdb/shared';
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

const FpsIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetName1} and {props.chipsetName2}&apos;s FPS
      performance with similar {props.marketSegment} GPUs. This provides insight
      into how its benchmark compares to its peers. This data is based on the
      FPS for{' '}
      <Button variant={ButtonVariant.Link} onClick={props.handleGameClick}>
        {props.selectedGameName}
      </Button>
      . Higher is better.
    </>
  ),
});

export const RelativeGameFpsIntro = () => {
  const { contentTags, contentParams } = useProductContent();
  const { viewModel } = usePageContext();
  const { selectedGame, setSelectedGame } = useGameSelection();

  const { comparison } = viewModel;
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const games = useMemo(() => getGamesFromProducts(comparison), [comparison]);
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

  const chipsetName1 = formatProductName(chipset1, { company: false });
  const chipsetName2 = formatProductName(chipset2, { company: false });

  return (
    <ContentProvider
      tags={contentTags}
      params={{
        ...contentParams,
        selectedGameName: gameName,
        chipsetName1,
        chipsetName2,
        handleGameClick,
      }}
    >
      <p className="text-dimmed">
        <FpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
