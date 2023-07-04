import {
  CpuMarketSegmentValue,
  CpuProductionStatusValue,
} from '@pcpartdb/shared';
import {
  formatCpuMarketSegment,
  formatCpuProductionStatus,
} from 'packages/website/src/client/product';
import { ProductEnumItem } from '../../product';

const MARKET_SEGMENTS: ProductEnumItem[] = [
  {
    label: formatCpuMarketSegment(CpuMarketSegmentValue.Desktop),
    value: CpuMarketSegmentValue.Desktop,
  },
  {
    label: formatCpuMarketSegment(CpuMarketSegmentValue.Mobile),
    value: CpuMarketSegmentValue.Mobile,
  },
  {
    label: formatCpuMarketSegment(CpuMarketSegmentValue.Workstation),
    value: CpuMarketSegmentValue.Workstation,
  },
];

const PRODUCTION_STATUS: ProductEnumItem[] = [
  {
    label: formatCpuProductionStatus(CpuProductionStatusValue.Active),
    value: CpuProductionStatusValue.Active,
  },
  {
    label: formatCpuProductionStatus(CpuProductionStatusValue.EndOfLife),
    value: CpuProductionStatusValue.EndOfLife,
  },
  {
    label: formatCpuProductionStatus(CpuProductionStatusValue.Unreleased),
    value: CpuProductionStatusValue.Unreleased,
  },
];

export const ENUMS: Record<string, ProductEnumItem[]> = {
  marketSegments: MARKET_SEGMENTS,
  productionStatus: PRODUCTION_STATUS,
};
