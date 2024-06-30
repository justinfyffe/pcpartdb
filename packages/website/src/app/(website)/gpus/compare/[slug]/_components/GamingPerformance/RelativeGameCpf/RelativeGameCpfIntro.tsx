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

const ValueIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      The average cost per frame in{' '}
      <Button
        variant={ButtonVariant.Link}
        onClick={props.handleGameClick}
        className="underline decoration-dotted decoration-1"
      >
        {props.selectedGameName}
      </Button>{' '}
      can be compared to similar GPUs to assess relative value. Generally, a
      lower cost per frame implies better value for your money.
    </>
  ),
});

export const RelativeGameCpfIntro = () => {
  const { viewModel } = usePageContext();
  const { selectedGame, setSelectedGame } = useGameSelection();
  const { comparison } = viewModel;

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
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
