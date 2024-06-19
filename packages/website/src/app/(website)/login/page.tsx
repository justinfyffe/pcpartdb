import {
  getHomePath,
  getLoginPath,
  getLoginUrl,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { Metadata } from 'next';
import React from 'react';
import { Breadcrumb } from '../../_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../_common/components/Breadcrumbs/Breadcrumbs';
import { LoginForm } from './_components/LoginForm/LoginForm';

const TITLE = 'Sign in to your Account';

export const metadata: Metadata = {
  title: `${TITLE} - ${WEBSITE_NAME}`,
  robots: 'noindex',
  alternates: {
    canonical: getLoginUrl(),
  },
};

export default function LoginPage() {
  return (
    <>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb>{TITLE}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">{TITLE}</h1>

        <LoginForm />
      </article>
    </>
  );
}
