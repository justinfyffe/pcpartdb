import React from 'react';
import * as ReactDOM from 'react-dom';

interface DialogOptions {
  disableClose?: boolean;
}

const DIALOG_CLASS =
  'items-center bottom-0 flex justify-center left-0 fixed right-0 top-0 z-[998]';
const OVERLAY_CLASS =
  'bg-[#373a47] bottom-0 left-0 absolute opacity-[0.8] right-0 top-0 z-[999]';
const CONTENT_CLASS =
  'items-center bottom-0 flex justify-center left-0 absolute right-0 top-0 z-[1000]';

export const showDialog = (
  content: React.ReactNode,
  options?: DialogOptions,
) => {
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
