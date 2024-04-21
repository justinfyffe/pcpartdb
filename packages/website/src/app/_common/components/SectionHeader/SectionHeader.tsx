'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';

interface SectionHeaderProps {
  linkId?: string;
  children: React.ReactNode;
  menu?: React.ReactNode;
}

export function SectionHeader(props: SectionHeaderProps) {
  const { linkId, children, menu } = props;

  const [urlCopied, setUrlCopied] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleCopyLinkClick = useCallback(() => {
    window.location.hash = linkId;
    window.navigator.clipboard.writeText(window.location.href);
    setUrlCopied(true);

    setTimeout(() => {
      setUrlCopied(false);
    }, 3_000);
  }, [linkId]);

  return (
    <div className="flex flex-col gap-4">
      <div
        id={linkId}
        className="flex justify-between items-center border-y-px bg-light-accent -mx-6 md:-mx-4 px-6 text-content"
      >
        <h2 className="font-semibold my-3">{children}</h2>

        <div className="flex gap-6 items-center">
          {urlCopied ? <span className="text-sm">URL copied!</span> : <></>}

          {linkId != null ? (
            <a
              className="text-2xl text-dimmed hover:underline cursor-pointer"
              onClick={handleCopyLinkClick}
            >
              #
            </a>
          ) : (
            <></>
          )}

          {menu != null ? (
            <Bars3Icon
              className="w-6 cursor-pointer"
              onClick={() => setMenuVisible(!menuVisible)}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      {menu != null && menuVisible ? <div>{menu}</div> : <></>}
    </div>
  );
}
