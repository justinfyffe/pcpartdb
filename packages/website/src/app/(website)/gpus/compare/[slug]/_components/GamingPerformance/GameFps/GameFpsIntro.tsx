'use client';

import { formatGameName, getGamesFromProducts } from '@pcpartdb/shared';
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
import React, { useCallback, useMemo } from 'react';
import { usePageContext } from '../../../PageProvider';

const GameFpsIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      This table showcases the average frame rate (FPS) achieved both GPUs in{' '}
      <Button
        variant={ButtonVariant.Link}
        onClick={props.handleGameClick}
        className="underline decoration-dotted decoration-1"
      >
        {props.selectedGameName}
      </Button>{' '}
      at various resolutions. Frame rate is a crucial indicator of how smoothly
      the GPU can run the game. A higher FPS generally translates to a smoother
      gameplay experience.
    </>
  ),
});
export const GameFpsIntro = () => {
  const { viewModel } = usePageContext();
  const comparison = viewModel.comparison;
  const { selectedGame, setSelectedGame } = useGameSelection();

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

  return (
    <ContentProvider
      params={{
        selectedGameName: gameName,
        handleGameClick,
      }}
    >
      <p>
        <GameFpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
