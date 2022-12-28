import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { classNames } from '../../ui';
import { Button } from '../button';

export interface MenuProps {
  label?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export const Menu: FunctionComponent<MenuProps> = (props) => {
  const { label, children, className, overlayClassName } = props;

  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const toggleButton = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isOpen]);

  return (
    <div className={classNames('block relative', className)}>
      <Button ref={buttonRef} onClick={toggleButton}>
        {label}
      </Button>

      <div
        ref={overlayRef}
        className={classNames(
          'absolute bg-white border-px shadow-md z-10 mt-px right-0 top-full',
          isOpen ? 'block' : 'hidden',
          overlayClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};
