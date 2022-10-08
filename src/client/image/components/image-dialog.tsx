import React, { FunctionComponent, useCallback, useState } from 'react';
import { Image } from '../../../shared/image';
import { Button, ButtonVariant } from '../../shared/components/button';
import { closeDialog } from '../../shared/components/dialog';
import { ImageDialogList } from './image-dialog-list';
import { ImageForm } from './image-form';

enum Tabs {
  List,
  Upload,
}

interface ImageDialogProps {
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
    <div className="bg-white flex flex-col h-[80%] w-[80%] p-4 overflow-auto max-w-[990px] rounded shadow">
      <div className="items-center flex justify-center m-[8px_-8px]">
        <Button
          type="button"
          variant={tab === Tabs.List ? ButtonVariant.Primary : undefined}
          onClick={handleListClick}
          className="border-[1px] border-solid border-[#ccc] flex-[1_0_0] mx-2"
        >
          Select Image
        </Button>

        <Button
          type="button"
          variant={tab === Tabs.Upload ? ButtonVariant.Primary : undefined}
          onClick={handleUploadClick}
          className="border-[1px] border-solid border-[#ccc] flex-[1_0_0] mx-2"
        >
          Upload Image
        </Button>
      </div>

      <div className="mt-4 overflow-x-hidden overflow-y-auto">
        {tab === Tabs.List && <ImageDialogList onSelect={handleSelect} />}
        {tab === Tabs.Upload && <ImageForm onSuccess={handleUpload} />}
      </div>
    </div>
  );
};
