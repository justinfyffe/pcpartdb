import { NextPageContext } from 'next';
import Router from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { authService } from './auth.service';

export const withStaffGuard = (Component: any) => {
  const Wrapper = (props: any) => {
    const checkUser = useCallback(async () => {
      const auth = await authService.loadCurrentUser();
      if (!auth?.user.isStaff) {
        Router.push('/login');
      }
    }, []);

    useEffect(() => {
      checkUser();
    }, [checkUser]);

    return <Component {...props} />;
  };

  Wrapper.getInitialProps = async (ctx: NextPageContext) => {
    const auth = await authService.loadCurrentUser();

    if (!auth?.user?.isStaff && ctx.res) {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
      return {};
    }

    return Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
  };

  return Wrapper;
};
