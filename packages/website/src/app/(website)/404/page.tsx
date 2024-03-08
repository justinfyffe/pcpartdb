import { getHomePath, WEBSITE_NAME } from '@pcpartdb/shared';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `Sorry, we could not find that page - ${WEBSITE_NAME}`,
  robots: 'noindex, follow',
};

export default async function NotFound() {
  return (
    <article>
      <h1 className="font-semibold mb-4">Sorry, we could not find that page</h1>

      <p>
        The page you are looking for may not exist. Please go to our{' '}
        <a href={getHomePath()}>home page</a> and try again.
      </p>
    </article>
  );
}
