import React, { FunctionComponent } from 'react';
import { classNames } from '../../utils/classNames';

interface AffiliateDisclaimerProps {
  className?: string;
}

export const AffiliateDisclaimer: FunctionComponent<
  AffiliateDisclaimerProps
> = (props) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        'flex items-center p-1 justify-end text-sm text-dark-shades',
        className,
      )}
    >
      As an Amazon Associate I earn from qualifying purchases.
    </div>
  );
};
