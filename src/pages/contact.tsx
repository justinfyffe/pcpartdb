import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonVariant } from '../web/shared/components/button';
import { Input } from '../web/shared/components/input';
import { WebsiteLayout } from '../web/shared/layouts/website';
import { classNames } from '../web/shared/ui/ui.utils';

interface ContactPageProps {}

const ContactPage = (_props: ContactPageProps) => {
  return (
    <WebsiteLayout>
      <main className="flex flex-col gap-6">
        <h1 className="text-2xl">Contact Us</h1>

        <p>Please fill in the following details to contact us.</p>

        <form className="flex flex-col gap-6">
          <div>
            <label>Your Name</label>
            <Input />
          </div>

          <div>
            <label>Your Email</label>
            <Input />
          </div>

          <div>
            <label>Your Message</label>
            <Input />
          </div>

          <div className="self-end">
            <Button variant={ButtonVariant.Primary}>Send</Button>
          </div>
        </form>
      </main>
      <aside></aside>
    </WebsiteLayout>
  );
};

ContactPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default ContactPage;
