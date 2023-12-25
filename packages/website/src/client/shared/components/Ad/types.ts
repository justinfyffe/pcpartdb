export enum AdUnit {
  ComparePageMidSummaryInArticle = 'COMPARE_PAGE_MID_SUMMARY_IN_ARTICLE',
  ComparePagePostPerfValueDisplay = 'COMPARE_PAGE_POST_PERF_VALUE_DISPLAY',
  ComparePagePostSummaryDisplay = 'COMPARE_PAGE_POST_SUMMARY_DISPLAY',
  ComparePagePostSummaryMultiplex = 'COMPARE_PAGE_POST_SUMMARY_MULTIPLEX',
  ComparePagePostTechSpecsMultiplex = 'COMPARE_PAGE_POST_TECH_SPECS_MULTIPLEX',
  ComparePagePreHighlightsDisplay = 'COMPARE_PAGE_PRE_HIGHLIGHTS_DISPLAY',

  ListPagePreTitleDisplay = 'LIST_PAGE_PRE_TITLE_DISPLAY',
  ListPageTableFooterMultiplex = 'LIST_PAGE_TABLE_FOOTER_MULTIPLEX',
  ListPageTableSideMultiplex = 'LIST_PAGE_TABLE_SIDE_MULTIPLEX',

  ViewPagePostPerfValueDisplay = 'VIEW_PAGE_POST_PERF_VALUE_DISPLAY',
  ViewPagePostSummaryDisplay = 'VIEW_PAGE_POST_SUMMARY_DISPLAY',
  ViewPagePostSummaryMultiplex = 'VIEW_PAGE_POST_SUMMARY_MULTIPLEX',
  ViewPagePostTechSpecsMultiplex = 'VIEW_PAGE_POST_TECH_SPECS_MULTIPLEX',
  ViewPagePreHighlightsDisplay = 'VIEW_PAGE_PRE_HIGHLIGHTS_DISPLAY',

  Test = 'TEST',
}

interface AdUnitConfig {
  slotId: string;
  enabled: boolean;
}

export const AD_UNITS: Record<AdUnit, AdUnitConfig> = {
  //
  // Compare Page Ads
  //

  [AdUnit.ComparePageMidSummaryInArticle]: {
    slotId: '3396984218',
    enabled: true,
  },
  [AdUnit.ComparePagePostPerfValueDisplay]: {
    slotId: '9988127509',
    enabled: true,
  },
  [AdUnit.ComparePagePostSummaryDisplay]: {
    slotId: '9877049501',
    enabled: true,
  },
  [AdUnit.ComparePagePostSummaryMultiplex]: {
    slotId: '4434733711',
    enabled: true,
  },
  [AdUnit.ComparePagePostTechSpecsMultiplex]: {
    slotId: '8325877265',
    enabled: true,
  },
  [AdUnit.ComparePagePreHighlightsDisplay]: {
    slotId: '4001303656',
    enabled: true,
  },

  //
  // List Page Ads
  //

  [AdUnit.ListPagePreTitleDisplay]: {
    slotId: '7525615691',
    enabled: true,
  },
  [AdUnit.ListPageTableFooterMultiplex]: {
    slotId: '1071887989',
    enabled: true,
  },
  [AdUnit.ListPageTableSideMultiplex]: {
    slotId: '7693136655',
    enabled: true,
  },

  //
  // View Page Ads
  //

  [AdUnit.ViewPagePostPerfValueDisplay]: {
    slotId: '1887681172',
    enabled: true,
  },
  [AdUnit.ViewPagePostSummaryDisplay]: {
    slotId: '2190131172',
    enabled: true,
  },
  [AdUnit.ViewPagePostSummaryMultiplex]: {
    slotId: '3422719151',
    enabled: true,
  },
  [AdUnit.ViewPagePostTechSpecsMultiplex]: {
    slotId: '4735800826',
    enabled: true,
  },
  [AdUnit.ViewPagePreHighlightsDisplay]: {
    slotId: '3009191155',
    enabled: true,
  },

  [AdUnit.Test]: {
    slotId: '0',
    enabled: true,
  },
};
