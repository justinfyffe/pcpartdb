import React from 'react';
import { NotFoundPage } from '../../errors';

export const withStaffGuard = (WrappedComponent: React.ComponentType<any>) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithStaffGuard = (props: any) => {
    const { config } = props;
    if (!config.isStaff) {
      return <NotFoundPage {...props} />;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithStaffGuard.displayName = `withStaffGuard(${displayName})`;

  return ComponentWithStaffGuard;
};
