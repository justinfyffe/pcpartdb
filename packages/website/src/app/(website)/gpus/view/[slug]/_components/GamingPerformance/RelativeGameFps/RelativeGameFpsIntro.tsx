'use client';

import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { GameSelectionDialogTrigger } from 'packages/website/src/app/_common/game/components/GameSelectionDialog/GameSelectionDialog';
import { useGamesFromProduct } from 'packages/website/src/app/_common/game/hooks/useGamesFromProduct';
import { useSelectedGameName } from 'packages/website/src/app/_common/game/hooks/useSelectedGameName';
import { useProductName } from 'packages/website/src/app/_common/product/hooks/useProductName';
import React from 'react';
import { usePageContext } from '../../../PageProvider';

const FpsIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      {props.name}&apos;s average frame rate (FPS) in{' '}
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
  const games = useGamesFromProduct(viewModel.gpu);
  const selectedGameName = useSelectedGameName();
  const name = useProductName(viewModel.gpu, { company: false });

  return (
    <ContentProvider
      params={{
        games,
        name,
        selectedGameName,
      }}
    >
      <p>
        <FpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
