import {
  DEFAULT_LIST_GAMES_LIMIT,
  DEFAULT_LIST_GAMES_OFFSET,
  Game,
  generateListGamesQueryFromPath,
  getAdminListGamesPath,
  ListGamesQuery,
  ListOrder,
  ListSort,
  Product,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { gameService } from 'packages/website/src/client/game/services/gameService';
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

export interface AdminListGamesContextState {
  games: Game[];
  totalGames: number;
  loading: boolean;
  query: ListGamesQuery;
  updateQuery: (query: ListGamesQuery) => void | Promise<void>;
}

export const AdminListGamesContext = createContext<AdminListGamesContextState>({
  games: [],
  totalGames: 0,
  loading: false,
  query: null,
  updateQuery: null,
});

export function useAdminListGamesContextBuilder() {
  const router = useRouter();
  const offset = Number(router.query.offset || DEFAULT_LIST_GAMES_OFFSET);
  const limit = Number(router.query.limit || DEFAULT_LIST_GAMES_LIMIT);
  const defaultSort = (router.query.sort as ListSort) ?? ListSort.ReleaseDate;
  const defaultOrder = (router.query.order as ListOrder) ?? ListOrder.Desc;
  const initialSearch = router.query.search as string;

  const [games, setGames] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [query, setQuery] = useState<ListGamesQuery>({
    filter: { search: initialSearch },
    pagination: { offset, limit },
    orderBy: { sort: defaultSort, order: defaultOrder },
  });

  const [loading, setLoading] = useState(false);

  const fetchGamesImpl = useCallback(
    async (query: ListGamesQuery, requestConfig?: RequestConfig) => {
      setLoading(true);
      const response = await gameService.list(query, requestConfig);
      if (requestConfig?.signal == null || !requestConfig.signal.aborted) {
        setGames(response.results as Game[]);
        setTotalGames(response.total);
        setQuery(response.query);
        setLoading(false);
      }
    },
    [],
  );
  const { func: fetchGames, abort: abortFetchGames } = useCancelable(
    useThrottle(fetchGamesImpl, 250),
  );

  useEffect(() => {
    router.beforePopState((cb) => {
      abortFetchGames?.();
      fetchGames(
        generateListGamesQueryFromPath({
          path: cb.as,
          defaults: {
            sort: defaultSort,
            order: defaultOrder,
          },
        }),
      );
      return true;
    });
  }, [
    abortFetchGames,
    defaultOrder,
    defaultSort,
    fetchGames,
    fetchGamesImpl,
    router,
  ]);

  const updateQuery = useCallback(
    async (query: ListGamesQuery) => {
      abortFetchGames?.();
      await fetchGames(query);

      const url = getAdminListGamesPath(query);
      router.push(url, undefined, { shallow: true });
    },
    [abortFetchGames, fetchGames, router],
  );

  const context = useMemo(() => {
    return {
      games,
      totalGames,
      loading,
      query,
      updateQuery,
    } as AdminListGamesContextState;
  }, [games, totalGames, loading, query, updateQuery]);

  // Fetch products for the first time.
  // Should not be throttable or cancelable
  useEffect(() => {
    fetchGamesImpl(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context;
}
