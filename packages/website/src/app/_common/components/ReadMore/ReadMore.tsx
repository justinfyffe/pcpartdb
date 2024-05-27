'use client';

import React, { useEffect, useState } from 'react';
import useWindowDimensions from '../../hooks/browser/useWindowDimensions';
import { classNames } from '../../utils/classNames';
import { GenericButton } from '../Button/GenericButton';

interface ReadMoreProps {
  as?: React.ElementType;
  className?: string;
  mobileOnly?: boolean;

  children?: React.ReactNode;
}

export function ReadMore(props: ReadMoreProps) {
  const Element = props.as || 'div';
  const [showingMore, setShowingMore] = useState(
    props.mobileOnly ? true : false,
  );

  const windowDimensions = useWindowDimensions();
  useEffect(() => {
    // Must be done in an effect so it's only on the client.
    // For hydration consistency purposes.
    if (windowDimensions.width < 768 && props.mobileOnly) {
      setShowingMore(false);
    }
  }, [props.mobileOnly, windowDimensions.width]);

  return (
    <Element
      className={classNames(
        'relative',
        showingMore ? '' : ' sm:max-h-52 sm:overflow-hidden',
        props.className,
      )}
    >
      {props.children}
      {!showingMore && (
        <div className="absolute backdrop-blur-sm bg-white/30 hidden sm:block left-0 right-0 bottom-0 pt-4 pb-4">
          <div className="flex items-center justify-center">
            <GenericButton onClick={() => setShowingMore(true)}>
              Read More
            </GenericButton>
          </div>
        </div>
      )}
    </Element>
  );
}
