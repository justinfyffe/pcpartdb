import React from 'react';

interface RootTemplateProps {
  children: React.ReactNode;
}

export default function RootTemplate(props: RootTemplateProps) {
  return <>{props.children}</>;
}
