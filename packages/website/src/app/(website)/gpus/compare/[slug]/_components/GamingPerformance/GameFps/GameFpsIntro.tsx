'use client';

import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { GameSelectionDialogTrigger } from 'packages/website/src/app/_common/game/components/GameSelectionDialog/GameSelectionDialog';
import { useGamesFromProducts } from 'packages/website/src/app/_common/game/hooks/useGamesFromProducts';
import { useSelectedGameName } from 'packages/website/src/app/_common/game/hooks/useSelectedGameName';
import React from 'react';
import { usePageContext } from '../../../PageProvider';

const GameFpsIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      This table showcases the average frame rate (FPS) achieved both GPUs in{' '}
      <GameSelectionDialogTrigger
        games={props.games}
        buttonVariant={ButtonVariant.LinkDialog}
      >
        {props.selectedGameName}
      </GameSelectionDialogTrigger>{' '}
      at various resolutions. Frame rate is a crucial indicator of how smoothly
      the GPU can run the game. A higher FPS generally translates to a smoother
      gameplay experience.
    </>
  ),
});
export const GameFpsIntro = () => {
  const { viewModel } = usePageContext();
  const games = useGamesFromProducts(viewModel.comparison);
  const selectedGameName = useSelectedGameName();

  return (
    <ContentProvider
      params={{
        games,
        selectedGameName,
      }}
    >
      <p>
        <GameFpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
