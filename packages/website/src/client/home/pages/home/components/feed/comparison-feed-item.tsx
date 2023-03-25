import { PhotoIcon } from '@heroicons/react/24/outline';
import { getCompareGpusPath, Gpu, GpuComparison } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import {
  formatGpuField,
  getCompareGpusSlug,
  getGpuName,
} from '../../../../../gpus';
import { getCompanyLogoImagePath } from '../../../../../image';
import { Card, Img } from '../../../../../shared/components';
import {
  compileContentComponent,
  ContentContext,
  ContentParams,
} from '../../../../../shared/content';
import { classNames } from '../../../../../shared/ui';

export enum ComparisonFeedTag {
  ComparePerformance = 'COMPARE_PERFORMANCE',
  CompareValue = 'COMPARE_VALUE',
}

interface ComparisonFeedItemProps {
  comparison: GpuComparison;
  tag?: ComparisonFeedTag;

  as?: React.ElementType;
  className?: string;
}

export const ComparisonFeedItem: FunctionComponent<ComparisonFeedItemProps> = (
  props,
) => {
  const { comparison, tag } = props;
  const [gpu1, gpu2] = comparison;

  const [price1, price2] = useMemo(
    () => [formatGpuField(gpu1.launchPrice), formatGpuField(gpu2.launchPrice)],
    [gpu1, gpu2],
  );

  const [image1, image2] = useMemo(() => {
    return [
      gpu1.images?.[0]?.image ?? getCompanyLogoImagePath(gpu1),
      gpu2.images?.[0]?.image ?? getCompanyLogoImagePath(gpu2),
    ];
  }, [gpu1, gpu2]);

  const [isCompanyImage1, isCompanyImage2] = useMemo(() => {
    return [
      image1 === getCompanyLogoImagePath(gpu1),
      image2 === getCompanyLogoImagePath(gpu2),
    ];
  }, [gpu1, image1, gpu2, image2]);

  return (
    <a
      href={getCompareGpusPath(getCompareGpusSlug(comparison))}
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-96 min-w-70',
        props.className,
      )}
    >
      <Card as="article" className="h-full">
        <div className="bg-white relative flex gap-0.5 m-[-16px_-16px_0] rounded-t rounded-b-none h-40 w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] overflow-hidden border-b-px">
          {image1 != null ? (
            <Img
              src={image1}
              className={classNames(
                'flex-1 h-40 object-contain overflow-hidden',
                isCompanyImage1 ? 'p-8' : '',
                props.className,
              )}
            />
          ) : (
            <div
              className={classNames(
                'flex-1 flex flex-col items-center justify-center',
                'h-40',
              )}
            >
              <PhotoIcon className={classNames('-mb-3', 'w-23')} />
              <span className="font-semibold">No Image</span>
            </div>
          )}

          {image2 != null ? (
            <Img
              src={image2}
              className={classNames(
                'flex-1 h-40 object-contain overflow-hidden',
                isCompanyImage2 ? 'p-8' : '',
                props.className,
              )}
            />
          ) : (
            <div
              className={classNames(
                'flex-1 flex flex-col items-center justify-center',
                'h-40',
              )}
            >
              <PhotoIcon className={classNames('-mb-3', 'w-23')} />
              <span className="font-semibold">No Image</span>
            </div>
          )}

          <div className="flex flex-1 w-full h-full absolute items-end">
            <Banner gpu={gpu1} className="mr-[23px] max-w-[calc(50%-23px)]" />
            <Banner gpu={gpu2} className="ml-[23px] max-w-[calc(50%-23px)]" />
          </div>

          <div className="flex w-full h-full absolute items-start justify-between rounded-t">
            {price1 != null && (
              <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-xs bg-[rgba(51,65,85,1)] border-b-px border-r-px border-gray-50 rounded-tl rounded-br">
                {price1}
              </div>
            )}
            {price2 != null && (
              <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-xs bg-[rgba(51,65,85,1)]  border-b-px border-l-px border-gray-50 rounded-tr rounded-bl">
                {price2}
              </div>
            )}
          </div>

          <div className="flex w-full h-full items-end justify-center absolute">
            <div className="text-[#ececec] font-semibold px-3 text-sm rounded-t bg-[rgba(51,65,85,1)] border-0.5 border-b-0 border-gray-50">
              VS
            </div>
          </div>
        </div>

        <div className="flex flex-col text-sm">
          <h3 className="font-medium text-base text-indigo-500">
            {getGpuName(gpu1)} vs {getGpuName(gpu2)}
          </h3>
          <Subtitle comparison={comparison} tag={tag} />
        </div>
      </Card>
    </a>
  );
};

interface BannerProps {
  gpu: Gpu;
  className?: string;
}

const Banner: FunctionComponent<BannerProps> = (props) => {
  const { gpu, className } = props;
  const company = useMemo(() => gpu.company?.value?.toLowerCase(), [gpu]);

  return (
    <div
      className={classNames(
        'flex-1 text-[#ececec] font-semibold px-2 text-xs bg-[#666]',
        'border-t-px border-r-px border-gray-50 text-center',
        'text-ellipsis overflow-hidden whitespace-nowrap',
        company === 'nvidia' ? 'bg-[#558501]' : '',
        company === 'amd' ? 'bg-[#850101]' : '',
        company === 'intel' ? 'bg-[#0071c5]' : '',
        className,
      )}
    >
      {getGpuName(gpu, { company: false })}
    </div>
  );
};

interface SubtitleProps {
  comparison: GpuComparison;
  tag?: ComparisonFeedTag;
}

const Subtitle: FunctionComponent<SubtitleProps> = (props) => {
  const { comparison, tag } = props;
  const [gpu1, gpu2] = comparison;

  const params: ContentParams = useMemo(
    () => ({
      name1: getGpuName(gpu1, { company: false }),
      name2: getGpuName(gpu2, { company: false }),
    }),
    [gpu1, gpu2],
  );

  return (
    <ContentContext.Provider value={{ filters: [tag], params }}>
      <SubtitleSentence1 />
    </ContentContext.Provider>
  );
};

const SubtitleSentence1 = compileContentComponent(
  {
    filters: [ComparisonFeedTag.ComparePerformance],
    deps: ['name1', 'name2'],
    component: (props) => (
      <>
        Does the {props.name1} outperform the {props.name2}?
      </>
    ),
  },
  {
    filters: [ComparisonFeedTag.CompareValue],
    component: () => (
      <>Which of these graphics cards have the better bang for your buck?</>
    ),
  },
  {
    deps: ['name1', 'name2'],
    component: (props) => (
      <>
        How does the {props.name1} compare with the {props.name2}?
      </>
    ),
  },
);
