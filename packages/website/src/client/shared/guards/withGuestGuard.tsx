import React from 'react';
import { NotFoundPage } from '../../errors/pages/NotFoundPage/NotFoundPage';

export const withGuestGuard = (WrappedComponent: React.ComponentType<any>) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithGuestGuard = (props: any) => {
    const { config } = props;
    if (config.user != null) {
      return <NotFoundPage {...props} />;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithGuestGuard.displayName = `withGuestGuard(${displayName})`;

  return ComponentWithGuestGuard;
};
