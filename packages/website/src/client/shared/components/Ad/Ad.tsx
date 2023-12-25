import React, { FunctionComponent } from 'react';
import { useConfig } from '../../config/config-context';
import { classNames } from '../../ui/classNames';
import { AdUnit } from './types';
import { isEmptyAd, isFakeAd } from './utils';

export interface AdProps {
  unit: AdUnit;

  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Ad: FunctionComponent<AdProps> = (props) => {
  const { config } = useConfig();
  const { unit, children } = props;

  const renderEmpty = isEmptyAd({ unit, config });
  const renderFake = isFakeAd({ unit, config });

  if (renderEmpty) {
    return <></>;
  }

  if (renderFake) {
    // Show gray block
    return (
      <div className={classNames('h-24', props.className)}>
        <div
          className={classNames(
            'w-full h-full bg-adtest text-content text-xl flex flex-col items-center justify-center truncate ',
          )}
        >
          <span>Advertisement</span>
          <span>{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {children != null ? (
        <div className={props.className}>{children}</div>
      ) : (
        <></>
      )}
    </>
  );
};
