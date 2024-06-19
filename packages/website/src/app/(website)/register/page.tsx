import {
  getHomePath,
  getRegisterUrl,
  isApiError,
  RegisterViewModel,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { viewModelClient } from '../../_common/api/ViewModelClient';
import { Breadcrumb } from '../../_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../_common/components/Breadcrumbs/Breadcrumbs';
import { RegisterForm } from './_components/RegisterForm/RegisterForm';

const TITLE = 'Create Account';

export const metadata: Metadata = {
  title: `${TITLE} - ${WEBSITE_NAME}`,
  robots: 'noindex',
  alternates: {
    canonical: getRegisterUrl(),
  },
};

export default async function RegisterPage() {
  const response = await viewModelClient.get<RegisterViewModel>('register');
  if (isApiError(response)) {
    throw response;
  }

  if (response.totalUsers && response.totalUsers > 0) {
    throw notFound();
  }

  return (
    <>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb>{TITLE}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">{TITLE}</h1>

        <RegisterForm />
      </article>
    </>
  );
}
