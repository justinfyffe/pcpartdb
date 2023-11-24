import { getCookiePolicyPath } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { useConfig } from '../../config/config-context';
import { GenericButton } from '../Button/GenericButton';
import { PrimaryButton } from '../Button/PrimaryButton';

interface CookieConsentProps {}

export const CookieConsent: FunctionComponent<CookieConsentProps> = (props) => {
  const { config } = useConfig();

  const [visible, setVisible] = useState(
    config.requireCookieConsent === true && config.cookieConsent == null,
  );

  const handleReject = useCallback(async () => {
    // await legalService.updateCookieConsent({ consent: false });
    setVisible(false);
  }, []);

  const handleAccept = useCallback(async () => {
    // await legalService.updateCookieConsent({ consent: true });
    setVisible(false);
  }, []);

  if (!visible) {
    return <></>;
  }

  return (
    <div className="sticky bottom-0 bg-light-shades border-t-1 border-primary p-4">
      <div className="container">
        <div className="font-semibold text-xl mb-2">Cookie consent</div>

        <div className="flex flex-col gap-4">
          <div className="text-base">
            We use cookies to enhance the site experience, serve personalized
            ads, and analyze our traffic. By clicking &quot;Accept All&quot;,
            you consent to the use of cookies. <a href="#">Cookie Policy</a>.
          </div>

          <div className="flex justify-end gap-4">
            <GenericButton
              href={getCookiePolicyPath()}
              className="bg-transparent border-px border-black text-black rounded-none"
            >
              Preferences
            </GenericButton>

            <GenericButton
              onClick={handleReject}
              className="bg-transparent border-px border-black text-black rounded-none"
            >
              Reject
            </GenericButton>

            <PrimaryButton onClick={handleAccept} className="rounded-none">
              Accept
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
