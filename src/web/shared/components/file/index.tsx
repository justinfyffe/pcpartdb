import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, ButtonVariant } from '../button';
import { Input } from '../input';

let fileUploadId = 0;

export interface FileProps {
  name?: string;
  onChange?: (file: File) => void;

  children?: React.ReactNode;
}

export interface FileLabelProps {
  for?: string;

  children?: React.ReactNode;
}

export const File: FunctionComponent<FileProps> = (props) => {
  const { name, onChange } = props;
  const [file, setFile] = useState(null);
  const [inputId] = useState(fileUploadId);

  useEffect(() => {
    ++fileUploadId;
  }, []);

  const handleInputClick = useCallback(() => {
    document.getElementById(`file-upload-${inputId}`).click();
  }, [inputId]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const element = event.target as HTMLInputElement;
      const file = element.files[0];
      setFile(file);
      onChange?.(file);
    },
    [onChange],
  );

  return (
    <div className="block relative">
      <input
        type="file"
        id={`file-upload-${inputId}`}
        name={name}
        onChange={handleFileChange}
        className="h-[0.1px] opacity-0 overflow-hidden pr-[120px] absolute w-[0.1px] z-[-1]"
      />
      <Input value={file?.name || ''} onClick={handleInputClick} readOnly />
      <FileLabel for={`file-upload-${inputId}`}>Select File</FileLabel>
    </div>
  );
};

export const FileLabel: FunctionComponent<FileLabelProps> = (props) => {
  return (
    <Button
      as="label"
      htmlFor={props.for}
      className="bottom-0 flex flex-col justify-center mb-0 absolute right-0 top-0"
      variant={ButtonVariant.Primary}
    >
      {props.children}
    </Button>
  );
};
