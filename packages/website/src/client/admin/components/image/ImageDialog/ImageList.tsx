import { Image } from '@pcpartdb/shared';
import { imageService } from 'packages/website/src/client/image/imageService';
import { Spinner } from 'packages/website/src/client/shared/components/Spinner/Spinner';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImageListCard } from './ImageListCard';

interface ImageListProps {
  onSelect?: (image: Image) => void;
}

export const ImageList: FunctionComponent<ImageListProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const response = await imageService.list({
      filter: {},
    });
    setImages(response.results);
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
