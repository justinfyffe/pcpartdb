import 'reflect-metadata';
import {
  Button,
  ButtonVariant,
  Card,
  CardContent,
  CardTitle,
  Checkbox,
  Field,
  FieldHint,
  TextInput,
} from 'packages/website/src/client/shared/components';
import React from 'react';

interface CpusTabProps {}

export const CpusTab = (props: CpusTabProps) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <TextInput placeholder="Search CPUs" />
          <div className="flex gap-4">
            <Checkbox className="flex-1">New</Checkbox>{' '}
            <Checkbox className="flex-1">Updates</Checkbox>
          </div>
          <Button variant={ButtonVariant.Generic}>Refresh</Button>
        </div>

        <Card>
          <CardTitle>
            <div className="flex justify-between gap-4">
              <span>Intel i7-12345k</span> <span>New: 234621</span>
            </div>
          </CardTitle>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Field className="flex-1">
                <div className="flex justify-between">Name</div>
                <TextInput value="Intel i7-12345k" />
                <FieldHint>
                  This will be used as the CPU&apos;s name when it is created.
                </FieldHint>
              </Field>

              <Field className="flex-1">
                <div className="flex justify-between">Slug</div>
                <TextInput value="Intel i7-12345k" />
                <FieldHint>
                  This will be used for the CPU&apos;s URL when it is created.
                </FieldHint>
              </Field>

              <Button variant={ButtonVariant.Generic}>View</Button>
            </div>

            <div className="flex justify-between gap-4">
              <Button variant={ButtonVariant.Generic}>Reject</Button>
              <Button variant={ButtonVariant.Generic}>Approve</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardTitle>
            <div className="flex justify-between gap-4">
              <span>Intel i7-12345k</span> <span>Update: 234620</span>
            </div>
          </CardTitle>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Field className="flex-1">
                <div className="flex justify-between">Name</div>
                <TextInput value="Intel i7-12345k" disabled />
              </Field>

              <Field className="flex-1">
                <div className="flex justify-between">Slug</div>
                <TextInput value="Intel i7-12345k" disabled />
              </Field>

              <Button variant={ButtonVariant.Generic}>Diff (3)</Button>
            </div>

            <div className="flex justify-between gap-4">
              <Button variant={ButtonVariant.Generic}>Reject</Button>
              <Button variant={ButtonVariant.Generic}>View Page</Button>
              <Button variant={ButtonVariant.Generic}>Approve</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
