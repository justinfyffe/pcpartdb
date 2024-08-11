import { getForgotPasswordUrl, getHomePath } from '@pcpartdb/shared';
import { Metadata } from 'next';
import React from 'react';
import { Breadcrumb } from '../../_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../_common/components/Breadcrumbs/Breadcrumbs';
import { ForgotPasswordForm } from './_components/ForgotPasswordForm';

const TITLE = 'Forgot your Password?';
const DESCRIPTION = 'Mission statement and contact details for PC Part DB.';
const URL = getForgotPasswordUrl();

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: 'noindex',
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    url: URL,
  },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb>{TITLE}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">{TITLE}</h1>

        <ForgotPasswordForm />
      </article>
    </>
  );
}
