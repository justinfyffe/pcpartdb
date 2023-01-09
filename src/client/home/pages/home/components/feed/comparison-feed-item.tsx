import { getCompanyLogoImagePath } from '@client/image';
import { formatSpec, getCompareGpusSlug, getGpuName } from '@client/part';
import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { getCompareGpusPath } from '@client/shared/website';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Part, PartComparison } from '@shared/part';
import React, { FunctionComponent, useMemo } from 'react';

interface ComparisonFeedItemProps {
  parts: PartComparison;

  as?: React.ElementType;
  className?: string;
}

export const ComparisonFeedItem: FunctionComponent<ComparisonFeedItemProps> = (
  props,
) => {
  const { parts } = props;
  const [part1, part2] = parts;

  const [price1, price2] = useMemo(
    () => [
      formatSpec(part1.specs?.launchPrice),
      formatSpec(part2.specs?.launchPrice),
    ],
    [part1, part2],
  );

  const [image1, image2] = useMemo(() => {
    return [
      part1.images?.[0]?.image ?? getCompanyLogoImagePath(part1),
      part2.images?.[0]?.image ?? getCompanyLogoImagePath(part2),
    ];
  }, [part1, part2]);

  return (
    <a
      href={getCompareGpusPath(getCompareGpusSlug(parts))}
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

          <div className="flex gap-11.5 w-full h-full absolute items-end justify-center">
            <Banner part={part1} />
            <Banner part={part2} />
          </div>

          <div className="flex w-full h-full absolute items-start justify-between rounded-t">
            <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-xs bg-[rgba(51,65,85,1)] border-b-px border-r-px border-gray-50 rounded-tl rounded-br">
              {price1}
            </div>
            <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-xs bg-[rgba(51,65,85,1)]  border-b-px border-l-px border-gray-50 rounded-tr rounded-bl">
              {price2}
            </div>
          </div>

          <div className="flex w-full h-full items-end justify-center absolute">
            <div className="text-[#ececec] font-semibold px-3 text-sm rounded-t bg-[rgba(51,65,85,1)] border-0.5 border-b-0 border-gray-50">
              VS
            </div>
          </div>
        </div>

        <div className="flex flex-col text-sm">
          <h3 className="font-medium text-base text-indigo-500">
            {getGpuName(part1)} vs {getGpuName(part2)}
          </h3>
          <Subtitle parts={parts} />
        </div>
      </Card>
    </a>
  );
};

interface BannerProps {
  part: Part;
}

const Banner: FunctionComponent<BannerProps> = (props) => {
  const { part } = props;
  const company = useMemo(
    () => part.specs?.company?.value?.toLowerCase(),
    [part],
  );

  return (
    <div
      className={classNames(
        'flex-1 text-[#ececec] font-semibold px-2 text-xs bg-[#666] border-t-px border-r-px border-gray-50 text-center',
        company === 'nvidia' ? 'bg-[#558501]' : '',
        company === 'amd' ? 'bg-[#850101]' : '',
      )}
    >
      {getGpuName(part, { company: false })}
    </div>
  );
};

interface SubtitleProps {
  parts: Part[];
}

const Subtitle: FunctionComponent<SubtitleProps> = (props) => {
  const { parts } = props;
  const [part1, part2] = parts;

  const name1 = useMemo(() => getGpuName(part1, { company: false }), [part1]);
  const name2 = useMemo(() => getGpuName(part2, { company: false }), [part2]);

  return (
    <>
      How does the {name1} compare with the {name2}?
    </>
  );
};
