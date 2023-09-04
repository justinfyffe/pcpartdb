import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useLayout } from '../../layouts';
import { classNames } from '../../ui';
import { Button, ButtonVariant } from '../Button/Button';
import { TextInput } from '../Input';

export interface FileProps {
  name?: string;
  onChange?: (file: File) => void;

  children?: React.ReactNode;

  className?: string;
}

export const File: FunctionComponent<FileProps> = (props) => {
  const { name, onChange, className } = props;
  const [file, setFile] = useState(null);

  const layout = useLayout();
  const [fileId] = useState(() => layout.fieldCounter++);

  const fileRef = useRef<HTMLInputElement>();
  const inputId = `file-upload-${fileId}`;

  const handleInputClick = useCallback(() => {
    fileRef.current.click();
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const element = e.target as HTMLInputElement;
      const file = element.files[0];
      setFile(file);
      onChange?.(file);
    },
    [onChange],
  );

  return (
    <div className={classNames('block relative', className)}>
      <input
        type="file"
        id={inputId}
        name={name}
        onChange={handleFileChange}
        className="h-[0.1px] opacity-0 overflow-hidden pr-30 absolute w-[0.1px] z-[-1]"
        ref={fileRef}
      />
      <TextInput value={file?.name} onClick={handleInputClick} readOnly />
      <FileLabel for={inputId}>Select File</FileLabel>
    </div>
  );
};

interface FileLabelProps {
  for?: string;

  children?: React.ReactNode;
}

const FileLabel: FunctionComponent<FileLabelProps> = (props) => {
  return (
    <Button
      as="label"
      htmlFor={props.for}
      className="bottom-0 flex flex-col justify-center mb-0 absolute right-0 top-0"
      variant={ButtonVariant.Warning}
    >
      {props.children}
    </Button>
  );
};
