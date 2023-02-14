import { formatGpuSpec, getGpuName, getViewGpuSlug } from '@client/gpus';
import { getCompanyLogoImagePath } from '@client/image';
import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { getViewGpuPath } from '@client/shared/website';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Gpu } from '@shared/gpus';
import React, { FunctionComponent, useMemo } from 'react';

export enum GpuFeedTag {
  GreatPerformance = 'GREAT_PERFORMANCE',
  GreatValue = 'GREAT_VALUE',
}

interface GpuFeedItemProps {
  gpu: Gpu;
  tag?: GpuFeedTag;

  as?: React.ElementType;
  className?: string;
}

export const GpuFeedItem: FunctionComponent<GpuFeedItemProps> = (props) => {
  const { gpu, tag } = props;

  const price = useMemo(() => formatGpuSpec(gpu.specs?.launchPrice), [gpu]);

  const label = useMemo(() => {
    if (tag === GpuFeedTag.GreatPerformance) {
      return 'Great Performance';
    } else if (tag === GpuFeedTag.GreatValue) {
      return 'Great Value';
    } else {
      return null;
    }
  }, [tag]);

  const images = useMemo(() => {
    const ret = [
      gpu.images?.[0]?.image,
      gpu.images?.[1]?.image ?? getCompanyLogoImagePath(gpu),
    ];
    return ret.filter((image) => image != null);
  }, [gpu]);

  const isCompanyImage = useMemo(() => {
    return images.map((image) => image === getCompanyLogoImagePath(gpu));
  }, [gpu, images]);

  return (
    <a
      href={getViewGpuPath(getViewGpuSlug(gpu))}
      className={classNames(
        'flex-1',
        'mx-4 mb-6',
        'max-w-96 min-w-70',
        props.className,
      )}
    >
      <Card as="article" className="h-full">
        <div
          className={classNames(
            'bg-white',
            'relative',
            'flex gap-0.5',
            'm-[-16px_-16px_0]',
            'h-40 w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)]',
            'border-b-px rounded-t',
            'overflow-hidden',
          )}
        >
          {images.map((image, i) => (
            <Img
              key={i}
              src={image}
              className={classNames(
                'bg-white',
                'flex-1',
                'h-40',
                'object-contain overflow-hidden',
                isCompanyImage[i] ? 'p-4' : '',
                props.className,
              )}
            />
          ))}
          {images.length === 0 && (
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

          <div
            className={classNames(
              'absolute',
              'flex items-start justify-between',
              'rounded-t',
              'h-full w-full',
            )}
          >
            {price != null && (
              <div
                className={classNames(
                  'bg-[rgba(51,65,85,1)]',
                  'font-normal text-xs text-[#ececec]',
                  'px-1.5 py-0.5',
                  'border-b-px border-r-px border-gray-50 rounded-br rounded-tl',
                )}
              >
                {price}
              </div>
            )}

            {label && (
              <div
                className={classNames(
                  'bg-[rgba(51,65,85,1)]',
                  'font-normal text-xs text-[#ececec]',
                  'px-1.5 py-0.5',
                  'border-b-px border-l-px border-gray-50 rounded-bl rounded-tr',
                )}
              >
                {label}
              </div>
            )}
          </div>
        </div>

        <div className={classNames('flex flex-col gap-2 text-sm')}>
          <h3 className="font-medium text-base text-indigo-500">
            {getGpuName(gpu)}
          </h3>
          <Subtitle gpu={gpu} tag={tag} />
        </div>
      </Card>
    </a>
  );
};

interface SubtitleProps {
  gpu: Gpu;
  tag?: GpuFeedTag;
}

const Subtitle: FunctionComponent<SubtitleProps> = (props) => {
  const { gpu, tag } = props;

  const text = useMemo(() => {
    const name = getGpuName(gpu, { company: false });

    if (tag === GpuFeedTag.GreatPerformance) {
      return `The ${name} is a powerful card, but is it worth the money?`;
    } else if (tag === GpuFeedTag.GreatValue) {
      return `The ${name} is known for good value, but how well does it perform?`;
    } else {
      return `Learn more about the ${name}.`;
    }
  }, [gpu, tag]);

  return <>{text}</>;
};
