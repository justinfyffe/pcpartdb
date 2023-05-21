import { MarketSegmentValue } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Checkbox } from '../../../../../shared/components';
import { classNames } from '../../../../../shared/ui';
import { formatMarketSegment } from '../../../../utils';
import { ListPageContext } from '../../context';

interface ListFilterMarketSegmentProps {
  className?: string;
}

export const ListFilterMarketSegment: FunctionComponent<
  ListFilterMarketSegmentProps
> = (props) => {
  const { query, updateQuery } = useContext(ListPageContext);

  const segments = useMemo(
    () => new Set<MarketSegmentValue>(query.filter?.segment),
    [query.filter?.segment],
  );

  const handleMarketSegmentToggle = useCallback(
    (segment: MarketSegmentValue, enabled: boolean) => {
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
        marketSegment={MarketSegmentValue.Desktop}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegmentValue.Mobile}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegmentValue.Workstation}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={MarketSegmentValue.Integrated}
        onChange={handleMarketSegmentToggle}
      />
    </div>
  );
};

interface ListFilterMarketSegmentItemProps {
  marketSegment: MarketSegmentValue;
  onChange: (segment: MarketSegmentValue, value: boolean) => void;
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
      className="hover:bg-slate-100 p-2"
    >
      {name}
    </Checkbox>
  );
};
