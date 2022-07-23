import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Image } from '../../../types/image';
import { Spinner } from '../../shared/components/spinner';
import { imageService } from '../image.service';
import { ImageDialogListCard } from './image-dialog-list-card';

interface ImageDialogListProps {
  onSelect?: (image: Image) => void;
}

export const ImageDialogList: FunctionComponent<ImageDialogListProps> = (
  props,
) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setImages(await imageService.list());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="flex flex-wrap justify-center m-[0px_-8px]">
      {!loading &&
        images.map((image) => (
          <div key={image.id} className="cursor-pointer m-2 w-[300px]">
            <ImageDialogListCard
              image={image}
              hidePath={true}
              onClick={props.onSelect}
            />
          </div>
        ))}

      {loading && <Spinner />}
    </div>
  );
};
