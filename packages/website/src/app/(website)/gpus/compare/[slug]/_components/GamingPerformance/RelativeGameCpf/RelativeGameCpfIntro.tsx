'use client';

import {
  formatGameName,
  formatProductName,
  getGamesFromProducts,
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

const ValueIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.gpuName1} and {props.gpuName2}&apos;s cost per frame with
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
  const { selectedGame, setSelectedGame } = useGameSelection();
  const { comparison } = viewModel;
  const [gpu1, gpu2] = comparison;

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

  const gpuName1 = formatProductName(gpu1, { company: false });
  const gpuName2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider
      tags={contentTags}
      params={{
        ...contentParams,
        selectedGameName: gameName,
        gpuName1,
        gpuName2,
        handleGameClick,
      }}
    >
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
