import { CpuMarketSegmentValue } from '@pcpartdb/shared';
import { formatCpuMarketSegment } from 'packages/website/src/client/product/utils';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Checkbox } from '../../../../../../shared/components';
import { classNames } from '../../../../../../shared/ui';
import { ListPageContext } from '../../context';

interface ListFilterMarketSegmentProps {
  className?: string;
}

export const ListFilterMarketSegment: FunctionComponent<
  ListFilterMarketSegmentProps
> = (props) => {
  const { query, updateQuery } = useContext(ListPageContext);

  const segments = useMemo(
    () => new Set<CpuMarketSegmentValue>(query.filter?.segment),
    [query.filter?.segment],
  );

  const handleMarketSegmentToggle = useCallback(
    (segment: CpuMarketSegmentValue, enabled: boolean) => {
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
        marketSegment={CpuMarketSegmentValue.Desktop}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={CpuMarketSegmentValue.Mobile}
        onChange={handleMarketSegmentToggle}
      />
      <ListFilterMarketSegmentItem
        marketSegment={CpuMarketSegmentValue.Workstation}
        onChange={handleMarketSegmentToggle}
      />
    </div>
  );
};

interface ListFilterMarketSegmentItemProps {
  marketSegment: CpuMarketSegmentValue;
  onChange: (segment: CpuMarketSegmentValue, value: boolean) => void;
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
    () => formatCpuMarketSegment(marketSegment),
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
