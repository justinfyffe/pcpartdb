import * as ReactDOM from 'react-dom';

interface DialogOptions {
  disableClose?: boolean;
}

const DIALOG_CLASS =
  'items-center b-0 flex justify-center l-0 fixed r-0 t-0 z-[998]';
const OVERLAY_CLASS =
  'bg-[#373a47] b-0 l-0 absolute opacity-[0.8] r-0 t-0 z-[999]';
const CONTENT_CLASS =
  'items-center b-0 flex justify-center l-0 absolute r-0 t-0 z-[1000]';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showDialog = (content: any, options?: DialogOptions) => {
  const { dialogElement, contentElement } = createElements();

  document.body.appendChild(dialogElement);
  ReactDOM.createPortal(content, contentElement);

  if (!options?.disableClose) {
    contentElement.addEventListener('click', (e) => {
      if (e.target !== contentElement) {
        return;
      }

      closeDialog();
    });
  }
};

export const closeDialog = () => {
  const dialogElement = document.querySelector(`.${DIALOG_CLASS}`);
  if (dialogElement == null) {
    return;
  }

  document.body.removeChild(dialogElement);
};

const createElements = () => {
  const dialogElement = document.createElement('div');
  dialogElement.className = DIALOG_CLASS;

  const overlayElement = document.createElement('div');
  overlayElement.className = OVERLAY_CLASS;
  dialogElement.appendChild(overlayElement);

  const contentElement = document.createElement('div');
  contentElement.className = CONTENT_CLASS;
  dialogElement.appendChild(contentElement);

  return { dialogElement, overlayElement, contentElement };
};
