'use client';

import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { GameSelectionDialogTrigger } from 'packages/website/src/app/_common/game/components/GameSelectionDialog/GameSelectionDialog';
import { useGamesFromProducts } from 'packages/website/src/app/_common/game/hooks/useGamesFromProducts';
import { useSelectedGameName } from 'packages/website/src/app/_common/game/hooks/useSelectedGameName';
import React from 'react';
import { usePageContext } from '../../../PageProvider';

const FpsIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      The average frame rate (FPS) in{' '}
      <GameSelectionDialogTrigger
        games={props.games}
        buttonVariant={ButtonVariant.LinkDialog}
      >
        {props.selectedGameName}
      </GameSelectionDialogTrigger>{' '}
      can be compared to similar GPUs to assess relative performance. Generally,
      higher FPS results in a smoother gameplay experience.
    </>
  ),
});

export const RelativeGameFpsIntro = () => {
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
        <FpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
