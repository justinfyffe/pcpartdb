'use client';

import { formatGameName } from '@pcpartdb/shared';
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
  Component: (props) => (
    <>
      Compare the average cost per frame in{' '}
      <Button variant={ButtonVariant.Link} onClick={props.handleGameClick}>
        {props.selectedGameName}
      </Button>{' '}
      with similar GPUs. A lower cost per frame translates to more performance
      for your money.
    </>
  ),
});

export const RelativeGameCpfIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  const { viewModel } = usePageContext();
  const gpu = viewModel.gpu;
  const { selectedGame, setSelectedGame } = useGameSelection();

  const games = useMemo(() => {
    return gpu?.games?.map((pg) => pg.game);
  }, [gpu]);
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
      <p>
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
