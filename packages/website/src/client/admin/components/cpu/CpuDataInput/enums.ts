import {
  CpuMarketSegmentValue,
  CpuProductionStatusValue,
  formatCpuMarketSegment,
  formatCpuProductionStatus,
} from '@pcpartdb/shared';
import { ProductEnumItem } from '../../product';

const MARKET_SEGMENT: ProductEnumItem[] = [
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
  {
    label: formatCpuMarketSegment(CpuMarketSegmentValue.Server),
    value: CpuMarketSegmentValue.Server,
  },
  {
    label: formatCpuMarketSegment(CpuMarketSegmentValue.Embedded),
    value: CpuMarketSegmentValue.Embedded,
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
  marketSegment: MARKET_SEGMENT,
  productionStatus: PRODUCTION_STATUS,
};
