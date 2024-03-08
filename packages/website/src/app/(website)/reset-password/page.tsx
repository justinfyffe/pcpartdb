import { getHomePath, WEBSITE_NAME } from '@pcpartdb/shared';
import { Metadata } from 'next';
import React from 'react';
import { Breadcrumb } from '../../_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../_common/components/Breadcrumbs/Breadcrumbs';
import { ResetPasswordForm } from './_components/ResetPasswordForm/ResetPasswordForm';

const TITLE = 'Reset Password';

export const metadata: Metadata = {
  title: `${TITLE} - ${WEBSITE_NAME}`,
  robots: 'noindex',
};

export default function ResetPasswordPage() {
  return (
    <>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb>{TITLE}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">{TITLE}</h1>

        <ResetPasswordForm />
      </article>
    </>
  );
}
