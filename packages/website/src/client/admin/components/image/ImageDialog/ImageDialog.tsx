import { Image, ImageManipulationPreset } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { closeDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { ImageForm } from '../ImageForm/ImageForm';
import { ImagesList } from '../ImagesList/ImagesList';
import { ImageList } from './ImageList';

enum Tabs {
  List,
  Upload,
}

interface ImageDialogProps {
  manipulation?: ImageManipulationPreset;
  onSelect: (image: Image) => void;
}

export const ImageDialog: FunctionComponent<ImageDialogProps> = (props) => {
  const { onSelect } = props;
  const [tab, setCurrentTab] = useState(Tabs.List);

  const handleListClick = useCallback(() => {
    setCurrentTab(Tabs.List);
  }, []);

  const handleSelect = useCallback(
    (image: Image) => {
      onSelect(image);
      closeDialog();
    },
    [onSelect],
  );

  const handleUploadClick = useCallback(() => {
    setCurrentTab(Tabs.Upload);
  }, []);

  const handleUpload = useCallback(
    (image: Image) => {
      onSelect(image);
      closeDialog();
    },
    [onSelect],
  );

  return (
    <div className="bg-white flex flex-col h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      <div className="items-center flex justify-center my-2 -mx-2">
        <Button
          type="button"
          variant={tab === Tabs.List ? ButtonVariant.Primary : undefined}
          onClick={handleListClick}
          className="border-px flex-1 mx-2"
        >
          Select Image
        </Button>

        <Button
          type="button"
          variant={tab === Tabs.Upload ? ButtonVariant.Primary : undefined}
          onClick={handleUploadClick}
          className="border-px flex-1 mx-2"
        >
          Upload Image
        </Button>
      </div>

      <div className="mt-4 overflow-x-hidden overflow-y-auto h-full">
        {tab === Tabs.List && <ImagesList onSelect={handleSelect} isDialog />}
        {tab === Tabs.Upload && (
          <ImageForm
            defaultManipulation={props.manipulation}
            onSuccess={handleUpload}
          />
        )}
      </div>
    </div>
  );
};
