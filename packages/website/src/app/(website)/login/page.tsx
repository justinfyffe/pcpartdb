import { getHomePath, getLoginUrl } from '@pcpartdb/shared';
import { Metadata } from 'next';
import React from 'react';
import { Breadcrumb } from '../../_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../_common/components/Breadcrumbs/Breadcrumbs';
import { LoginForm } from './_components/LoginForm/LoginForm';

const TITLE = 'Sign in to your Account';
const URL = getLoginUrl();

export const metadata: Metadata = {
  title: TITLE,
  robots: 'noindex',
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    locale: 'en_US',
    url: URL,
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
