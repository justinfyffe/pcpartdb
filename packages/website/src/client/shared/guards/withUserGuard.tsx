import NotFoundPage from 'packages/website/src/pages/404';
import React from 'react';

export const withUserGuard = (WrappedComponent: React.ComponentType<any>) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithUserGuard = (props: any) => {
    const { config } = props;
    if (config.user == null) {
      return <NotFoundPage {...props} />;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithUserGuard.displayName = `withUserGuard(${displayName})`;

  return ComponentWithUserGuard;
};
