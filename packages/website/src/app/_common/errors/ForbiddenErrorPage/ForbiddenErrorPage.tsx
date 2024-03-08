import { ApiError, getHomePath } from '@pcpartdb/shared';
import React from 'react';
import { Breadcrumb } from '../../components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';

interface ForbiddenErrorPageProps {
  error: ApiError;
}

export function ForbiddenErrorPage(_props: ForbiddenErrorPageProps) {
  return (
    <>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb>Forbidden</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">Forbidden</h1>

        <p>
          Sorry, you do not have access to this page. Please go back to our{' '}
          <a href={getHomePath()}>home page</a>.
        </p>
      </article>
    </>
  );
}
