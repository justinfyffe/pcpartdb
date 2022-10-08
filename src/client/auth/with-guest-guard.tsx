import { NextPageContext } from 'next';
import Router from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { authService } from './auth-service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withGuestGuard = (Component: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Wrapper = (props: any) => {
    const checkUser = useCallback(async () => {
      const auth = await authService.loadCurrentUser();

      if (auth?.user) {
        Router.push('/');
      }
    }, []);

    useEffect(() => {
      checkUser();
    }, [checkUser]);

    return <Component {...props} />;
  };

  Wrapper.getInitialProps = async (ctx: NextPageContext) => {
    const auth = await authService.loadCurrentUser();

    if (auth?.user && ctx.res) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
      return {};
    }

    return Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
  };

  return Wrapper;
};
