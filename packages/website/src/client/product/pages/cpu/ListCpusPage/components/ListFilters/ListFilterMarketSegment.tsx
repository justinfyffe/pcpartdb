import { formatMarketSegment, MarketSegment } from '@pcpartdb/shared';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { ListPageContext } from '../../context/ListPageContext';

interface ListFilterMarketSegmentProps {
  className?: string;
}

export const ListFilterMarketSegment: FunctionComponent<
  ListFilterMarketSegmentProps
> = (props) => {
  const { query, updateQuery } = useContext(ListPageContext);

  const segments = useMemo(
    () => new Set<MarketSegment>(query.filter?.segment),
    [query.filter?.segment],
  );

  const handleMarketSegmentToggle = useCallback(
    (segment: MarketSegment, enabled: boolean) => {
      if (enabled) {
        segments.add(segment);
      } else {
        segments.delete(segment);
      }

      updateQuery({
        ...query,
        pagination: { ...(query.pagination ?? {}), offset: 0 },
        filter: {
          ...query.filter,
          segment: segments.size > 0 ? [...segments.keys()] : undefined,
        },
      });
    },
    [segments, query, updateQuery],
  );

  return (
    <div className={classNames('flex flex-col', props.className)}>
      <div className="font-bold m-2">Market Segment:</div>
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegment.Desktop}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegment.Mobile}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegment.Workstation}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegment.Server}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegment.Embedded}
        onChange={handleMarketSegmentToggle}
      />
    </div>
  );
};

interface ListFilterMarketSegmentItemProps {
  marketSegment: MarketSegment;
  onChange: (segment: MarketSegment, value: boolean) => void;
}

const ListFilterMarketSegmentItem: FunctionComponent<
  ListFilterMarketSegmentItemProps
> = (props) => {
  const { marketSegment, onChange } = props;
  const { query } = useContext(ListPageContext);

  const value = useMemo(
    () => query.filter?.segment?.includes(marketSegment) ?? false,
    [marketSegment, query.filter?.segment],
  );
  const name = useMemo(
    () => formatMarketSegment(marketSegment),
    [marketSegment],
  );

  return (
    <Checkbox
      value={value}
      onChange={(value) => onChange(marketSegment, value)}
      className="hover:bg-mouse-hover p-2"
    >
      {name}
    </Checkbox>
  );
};
