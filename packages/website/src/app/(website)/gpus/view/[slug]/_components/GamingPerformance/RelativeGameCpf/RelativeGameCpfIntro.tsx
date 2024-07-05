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

const ValueIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      {props.name}&apos;s average cost per frame in{' '}
      <GameSelectionDialogTrigger
        games={props.games}
        buttonVariant={ButtonVariant.LinkDialog}
      >
        {props.selectedGameName}
      </GameSelectionDialogTrigger>{' '}
      can be compared to similar GPUs to assess relative value. Generally, a
      lower cost per frame implies better value for your money.
    </>
  ),
});

export const RelativeGameCpfIntro = () => {
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
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
