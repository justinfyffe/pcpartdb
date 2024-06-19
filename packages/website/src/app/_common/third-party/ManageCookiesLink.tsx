'use client';

import React, { useCallback } from 'react';

interface ManageCookiesLinkProps {}

export function ManageCookiesLink(_props: ManageCookiesLinkProps) {
  const handleClick = useCallback(async () => {
    (window as any).__tcfapi('displayConsentUi', 2, function () {});
  }, []);

  return (
    <span
      onClick={handleClick}
      className="text-light-shades underline cursor-pointer"
    >
      Manage Cookies
    </span>
  );
}
