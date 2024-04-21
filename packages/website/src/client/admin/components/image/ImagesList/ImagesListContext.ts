import {
  DEFAULT_LIST_IMAGES_LIMIT,
  DEFAULT_LIST_IMAGES_OFFSET,
  Image,
  ListImagesQuery,
  ListOrder,
  ListSort,
} from '@pcpartdb/shared';
import { imageService } from 'packages/website/src/client/image/imageService';
import { RequestConfig } from 'packages/website/src/client/shared/api/types';
import { useCancelable } from 'packages/website/src/client/shared/hooks/useCancelable';
import { useThrottle } from 'packages/website/src/client/shared/hooks/useThrottle';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ImagesListContextState {
  images: Image[];
  totalImages: number;
  loading: boolean;
  query: ListImagesQuery;
  updateQuery: (query: ListImagesQuery) => void | Promise<void>;
  loadPage: (page: number) => void;
}

export const ImagesListContext = createContext<ImagesListContextState>({
  images: [],
  totalImages: -1,
  loading: false,
  query: null,
  updateQuery: null,
  loadPage: null,
});

export function useImagesListContextBuilder() {
  const offset = Number(DEFAULT_LIST_IMAGES_OFFSET);
  const limit = Number(DEFAULT_LIST_IMAGES_LIMIT);
  const defaultSort = ListSort.Id;
  const defaultOrder = ListOrder.Desc;

  const [images, setImages] = useState<Image[]>([]);
  const [totalImages, setTotalImages] = useState(-1);
  const [query, setQuery] = useState<ListImagesQuery>({
    filter: { search: '' },
    pagination: { offset, limit },
    orderBy: { sort: defaultSort, order: defaultOrder },
  });

  const [loading, setLoading] = useState(false);

  const fetchImagesImpl = useCallback(
    async (
      queryAndOptions: ListImagesQuery & { reset?: boolean },
      requestConfig?: RequestConfig,
    ) => {
      setLoading(true);
      const { reset, ...query } = queryAndOptions;
      const response = await imageService.list(query, requestConfig);
      if (requestConfig?.signal == null || !requestConfig.signal.aborted) {
        const map = new Map<number, Image>();
        if (!reset) {
          for (const image of images) {
            map.set(image.id, image);
          }
        }
        for (const image of response.results) {
          map.set(image.id, image);
        }
        const newImages = [...map.values()];
        setImages(newImages);
        setTotalImages(response.total);
        setQuery(response.query);
        setLoading(false);
      }
    },
    [images],
  );
  const { func: fetchImages, abort: abortFetchImages } = useCancelable(
    useThrottle(fetchImagesImpl, 250),
  );

  const updateQuery = useCallback(
    async (query: ListImagesQuery) => {
      abortFetchImages?.();
      await fetchImages({ ...query, reset: true });
    },
    [abortFetchImages, fetchImages],
  );

  const loadPage = useCallback(
    async (page: number) => {
      await fetchImagesImpl({
        ...query,
        pagination: {
          offset: page * DEFAULT_LIST_IMAGES_LIMIT,
          limit: DEFAULT_LIST_IMAGES_LIMIT,
        },
      });
    },
    [fetchImagesImpl, query],
  );

  const context = useMemo(() => {
    return {
      images,
      totalImages,
      loading,
      query,
      updateQuery,
      loadPage,
    } as ImagesListContextState;
  }, [images, totalImages, loading, query, updateQuery, loadPage]);

  // Fetch products for the first time.
  // Should not be throttable or cancelable
  useEffect(() => {
    fetchImagesImpl(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context;
}
