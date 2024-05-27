import React from 'react';

export interface TableOfContentsLink {
  label: string;
  href: string;
}

interface TableOfContentsProps {
  links: TableOfContentsLink[];
}

export function TableOfContents(props: TableOfContentsProps) {
  const { links } = props;

  if (links == null || links.length == 0) {
    return <></>;
  }

  return (
    <div className="flex gap-x-6 gap-y-2 justify-between flex-wrap xs:justify-center">
      <span className="xs:w-full xs:text-center font-semibold md:text-xl">
        Contents:
      </span>
      {links.map((link) => (
        <a key={link.href} href={link.href} className="hover:underline">
          {link.label}
        </a>
      ))}
    </div>
  );
}
