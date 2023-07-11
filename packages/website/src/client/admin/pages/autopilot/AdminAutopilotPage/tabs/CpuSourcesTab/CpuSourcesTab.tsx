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
  FieldOptional,
  TextInput,
} from 'packages/website/src/client/shared/components';
import React from 'react';

interface CpuSourcesTabProps {}

export const CpuSourcesTab = (props: CpuSourcesTabProps) => {
  return (
    <>
      {/* CPU - Sources - Status, View, Edit, Approve, Reject, Combine */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <TextInput placeholder="Search CPU Sources" />
          <div className="flex gap-4">
            <Checkbox className="flex-1">TechPowerUp</Checkbox>{' '}
            <Checkbox className="flex-1">PassMark</Checkbox>{' '}
            <Checkbox className="flex-1">GeekBench</Checkbox>{' '}
            <Checkbox className="flex-1">Rejected</Checkbox>
          </div>
          <Button variant={ButtonVariant.Generic}>Refresh</Button>
        </div>

        <Card>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <CardTitle>Intel i7-12345k</CardTitle>
              <span className="text-sm text-dimmed">123456</span>
            </div>

            <div className="flex gap-4">
              <TextInput placeholder="Apply to CPU" />{' '}
              <Button variant={ButtonVariant.Generic} disabled>
                Apply
              </Button>
            </div>
          </div>
          <CardContent>
            <Field className="flex-1">
              <div className="flex justify-between">CPU Name</div>
              <TextInput value="Intel i7-12345k" />
              <FieldHint>
                This will be used as the CPU&apos;s name when it is created.
              </FieldHint>
            </Field>

            <div className="flex gap-4 items-center">
              <Field className="flex-1">
                <div className="flex justify-between">
                  TechPowerUp
                  <FieldOptional>
                    <a href="#">use name</a>
                  </FieldOptional>
                </div>
                <TextInput value="https://www.techpowerup.com/cpu-specs/ryzen-5-3600.c2132" />
                <FieldHint>Intel i7-12345k</FieldHint>
              </Field>
              <Field className="flex-1">
                <div className="flex justify-between">
                  PassMark
                  <FieldOptional>
                    <a href="#">use name</a>
                  </FieldOptional>
                </div>
                <TextInput value="https://www.cpubenchmark.net/cpu.php?cpu=AMD+EPYC+9654&id=5088" />
                <FieldHint>Intel i-7-12345k</FieldHint>
              </Field>
              <Field className="flex-1">
                <div className="flex justify-between">
                  GeekBench
                  <FieldOptional>
                    <a href="#">use name</a>
                  </FieldOptional>
                </div>
                <TextInput value="https://browser.geekbench.com/processors/intel-core-i9-13900ks" />
                <FieldHint>Intel i7 12345k</FieldHint>
              </Field>
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
              <span>Intel i7-12345k</span> <span>234620</span>
            </div>
          </CardTitle>
          <CardContent>
            <Field className="flex-1">
              <div className="flex justify-between">CPU Name</div>
              <TextInput value="Intel i7-12345k" />
              <FieldHint>
                This will be used as the CPU&apos;s name when it is created.
              </FieldHint>
            </Field>

            <div className="flex gap-4 items-center">
              <Field className="flex-1">
                <div className="flex justify-between">
                  TechPowerUp
                  <FieldOptional>
                    <a href="#">use name</a>
                  </FieldOptional>
                </div>
                <TextInput value="https://www.techpowerup.com/cpu-specs/ryzen-5-3600.c2132" />
                <FieldHint>Intel i7-12345k</FieldHint>
              </Field>
              <Field className="flex-1">
                <div className="flex justify-between">PassMark</div>
                <TextInput />
              </Field>
              <Field className="flex-1">
                <div className="flex justify-between">
                  GeekBench
                  <FieldOptional>
                    <a href="#">use name</a>
                  </FieldOptional>
                </div>
                <TextInput value="https://browser.geekbench.com/processors/intel-core-i9-13900ks" />
                <FieldHint>Intel i7 12345k</FieldHint>
              </Field>
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
              <span>Intel i7-12345k</span> <span>234619</span>
            </div>
          </CardTitle>
          <CardContent>
            <Field className="flex-1">
              <div className="flex justify-between">CPU Name</div>
              <TextInput value="Intel i7-12345k" />
              <FieldHint>
                This will be used as the CPU&apos;s name when it is created.
              </FieldHint>
            </Field>

            <div className="flex gap-4 items-center">
              <Field className="flex-1">
                <div className="flex justify-between">TechPowerUp</div>
                <TextInput />
              </Field>
              <Field className="flex-1">
                <div className="flex justify-between">
                  PassMark
                  <FieldOptional>
                    <a href="#">use name</a>
                  </FieldOptional>
                </div>
                <TextInput value="https://www.cpubenchmark.net/cpu.php?cpu=AMD+EPYC+9654&id=5088" />
                <FieldHint>Intel i-7-12345k</FieldHint>
              </Field>
              <Field className="flex-1">
                <div className="flex justify-between">GeekBench</div>
                <TextInput />
              </Field>
            </div>

            <div className="flex justify-between gap-4">
              <Button variant={ButtonVariant.Generic}>Reject</Button>
              <Button variant={ButtonVariant.Generic}>Approve</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
