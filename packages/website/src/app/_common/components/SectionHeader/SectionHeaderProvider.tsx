'use client';

import React, { createContext, useContext, useState } from 'react';
import { TableOfContentsLink } from '../TableOfContents/TableOfContents';

export interface SectionHeaderContextState {
  links?: TableOfContentsLink[];
  linksVisible?: boolean;
  setLinksVisible?: (visible?: boolean) => void;
}

export const SectionHeaderContext = createContext<SectionHeaderContextState>({
  links: [],
  linksVisible: false,
  setLinksVisible: () => {},
});

export function useSectionHeaderContext() {
  return useContext(SectionHeaderContext);
}

export interface SectionHeaderProviderProps {
  links?: TableOfContentsLink[];
  children: React.ReactNode;
}

export function SectionHeaderProvider(props: SectionHeaderProviderProps) {
  const { links } = props;
  const [linksVisible, setLinksVisible] = useState(false);

  return (
    <SectionHeaderContext.Provider
      value={{ links, linksVisible, setLinksVisible }}
    >
      {props.children}
    </SectionHeaderContext.Provider>
  );
}
