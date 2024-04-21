import {
  DEFAULT_LIST_GAMES_LIMIT,
  DEFAULT_LIST_GAMES_OFFSET,
  DEFAULT_LIST_IMAGES_LIMIT,
  DEFAULT_LIST_IMAGES_OFFSET,
  Game,
  generateListGamesQueryFromPath,
  generateListImagesQueryFromPath,
  getAdminListGamesPath,
  getAdminListImagesPath,
  Image,
  ListGamesQuery,
  ListImagesQuery,
  ListOrder,
  ListSort,
  Product,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { gameService } from 'packages/website/src/client/game/services/gameService';
import { imageService } from 'packages/website/src/client/image/imageService';
import { RequestConfig } from 'packages/website/src/client/shared/api/types';
import { useCancelable } from 'packages/website/src/client/shared/hooks/useCancelable';
import { useThrottle } from 'packages/website/src/client/shared/hooks/useThrottle';
import games from 'packages/website/src/pages/admin/games';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface AdminListImagesContextState {
  images: Image[];
  totalImages: number;
  loading: boolean;
  query: ListImagesQuery;
  updateQuery: (query: ListImagesQuery) => void | Promise<void>;
}

export const AdminListImagesContext =
  createContext<AdminListImagesContextState>({
    images: [],
    totalImages: 0,
    loading: false,
    query: null,
    updateQuery: null,
  });

export function useAdminListImagesContextBuilder() {
  const router = useRouter();
  const offset = Number(DEFAULT_LIST_IMAGES_OFFSET);
  const limit = Number(DEFAULT_LIST_IMAGES_LIMIT);
  const defaultSort = ListSort.Id;
  const defaultOrder = ListOrder.Desc;
  const initialSearch = router.query.search as string;

  const [images, setImages] = useState<Image[]>([]);
  const [totalImages, setTotalImages] = useState(0);
  const [query, setQuery] = useState<ListImagesQuery>({
    filter: { search: initialSearch },
    pagination: { offset, limit },
    orderBy: { sort: defaultSort, order: defaultOrder },
  });

  const [loading, setLoading] = useState(false);

  const fetchImagesImpl = useCallback(
    async (query: ListImagesQuery, requestConfig?: RequestConfig) => {
      setLoading(true);
      const response = await imageService.list(query, requestConfig);
      if (requestConfig?.signal == null || !requestConfig.signal.aborted) {
        setImages(response.results as Image[]);
        setTotalImages(response.total);
        setQuery(response.query);
        setLoading(false);
      }
    },
    [],
  );
  const { func: fetchImages, abort: abortFetchImages } = useCancelable(
    useThrottle(fetchImagesImpl, 250),
  );

  useEffect(() => {
    router.beforePopState((cb) => {
      abortFetchImages?.();
      fetchImages(
        generateListImagesQueryFromPath({
          path: cb.as,
          defaults: {
            sort: defaultSort,
            order: defaultOrder,
          },
        }),
      );
      return true;
    });
  }, [abortFetchImages, defaultOrder, defaultSort, fetchImages, router]);

  const updateQuery = useCallback(
    async (query: ListGamesQuery) => {
      abortFetchImages?.();
      await fetchImages(query);

      const url = getAdminListImagesPath(query);
      router.push(url, undefined, { shallow: true });
    },
    [abortFetchImages, fetchImages, router],
  );

  const context = useMemo(() => {
    return {
      images,
      totalImages,
      loading,
      query,
      updateQuery,
    } as AdminListImagesContextState;
  }, [images, totalImages, loading, query, updateQuery]);

  // Fetch products for the first time.
  // Should not be throttable or cancelable
  useEffect(() => {
    fetchImagesImpl(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context;
}
