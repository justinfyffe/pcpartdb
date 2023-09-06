import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent } from 'react';

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
        'flex items-center p-1 justify-end text-xs text-dark-shades',
        className,
      )}
    >
      As an Amazon Associate I earn from qualifying purchases.
    </div>
  );
};
