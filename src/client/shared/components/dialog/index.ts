import React from 'react';
import * as ReactDOM from 'react-dom';

interface DialogOptions {
  disableClose?: boolean;
}

const DIALOG_CLASS = 'dialog';
const OVERLAY_CLASS = 'dialog-overlay';
const CONTENT_CLASS = 'dialog-content';

export const showDialog = (
  content: React.ReactElement,
  options?: DialogOptions,
) => {
  const { dialogElement, contentElement } = createElements();

  document.body.appendChild(dialogElement);
  ReactDOM.render(content, contentElement);

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
