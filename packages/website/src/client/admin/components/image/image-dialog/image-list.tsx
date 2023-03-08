import { Image } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { imageService } from '../../../../image';
import { Spinner } from '../../../../shared/components';
import { ImageListCard } from './image-list-card';

interface ImageListProps {
  onSelect?: (image: Image) => void;
}

export const ImageList: FunctionComponent<ImageListProps> = (props) => {
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
    <div className="flex flex-wrap justify-center -mx-2">
      {!loading &&
        images.map((image) => (
          <div key={image.id} className="cursor-pointer m-2 w-75">
            <ImageListCard
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
