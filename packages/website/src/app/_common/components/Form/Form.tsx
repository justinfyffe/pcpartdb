import React, { FormEvent } from 'react';
import { classNames } from '../../utils/classNames';

interface FormProps {
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;

  children?: React.ReactNode;
}
export function Form(props: FormProps) {
  return (
    <form onSubmit={props.onSubmit} className={classNames(props.className)}>
      {props.children}
    </form>
  );
}
