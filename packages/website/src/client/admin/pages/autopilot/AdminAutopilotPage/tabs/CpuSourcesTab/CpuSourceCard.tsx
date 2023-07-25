import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  AutomationAction,
  CpuDataSourceKey,
  FetchCpuDataAction,
  ProductSource,
  ProductSourceGroup,
  ProductType,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import {
  ProductAutocomplete,
  productSourceService,
} from 'packages/website/src/client/product';
import { ProductSourceAutocomplete } from 'packages/website/src/client/product/components/ProductSourceAutocomplete';
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
import React, { useCallback, useMemo, useState } from 'react';

interface CpuSourceCardProps {
  sources: ProductSourceGroup;
}

export const CpuSourceCard = (props: CpuSourceCardProps) => {
  const { sources } = props;

  // Extract each individual source from the group
  const [techPowerUp, setTechPowerUp] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.TechPowerUp,
      )[0] || null
    );
  });
  const [passMark, setPassMark] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.PassMark,
      )[0] || null
    );
  });
  const [geekBench, setGeekBench] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.GeekBench,
      )[0] || null
    );
  });

  const [preferredName, setPreferredName] = useState(
    () => sources[0].sourceName,
  );
  const [appliedCpuId, setAppliedCpuId] = useState<number>(null);

  const subtitle = useMemo(
    () =>
      [
        techPowerUp ? 'TechPowerUp' : null,
        passMark ? 'PassMark' : null,
        geekBench ? 'GeekBench' : null,
      ]
        .filter((source) => source != null)
        .join(', '),
    [geekBench, passMark, techPowerUp],
  );

  const techPowerUpHint = useMemo(
    () => (techPowerUp != null ? `ID: ${techPowerUp.id}` : ''),
    [techPowerUp],
  );
  const passMarkHint = useMemo(
    () => (passMark != null ? `ID: ${passMark.id}` : ''),
    [passMark],
  );
  const geekBenchHint = useMemo(
    () => (geekBench != null ? `ID: ${geekBench.id}` : ''),
    [geekBench],
  );

  const handleApplyToCpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, geekBench]
      .filter((source) => source != null && source.id != null)
      .map((source) => ({ id: source.id, archive: source.archived }));

    await productSourceService.applyToProduct({
      productType: ProductType.Cpu,
      productId: appliedCpuId,
      sources,
    });
  }, [appliedCpuId, geekBench, passMark, techPowerUp]);

  const handleSetNameFromSource = useCallback((source: ProductSource) => {
    const name = source.sourceName;
    setPreferredName(name);
  }, []);

  const handleArchiveToggle = useCallback(
    (key: CpuDataSourceKey, value: boolean) => {
      if (key === CpuDataSourceKey.TechPowerUp) {
        setTechPowerUp({ ...techPowerUp, archived: value });
      } else if (key === CpuDataSourceKey.PassMark) {
        setPassMark({ ...passMark, archived: value });
      } else if (key === CpuDataSourceKey.GeekBench) {
        setGeekBench({ ...geekBench, archived: value });
      }
    },
    [geekBench, passMark, techPowerUp],
  );

  const handleArchive = useCallback(async () => {
    const sourcesToArchive = [techPowerUp, passMark, geekBench]
      .filter(
        (source) =>
          source != null && source.id != null && source.archived === true,
      )
      .map((source) => source.id);

    await productSourceService.archive({ sources: sourcesToArchive });
  }, [geekBench, passMark, techPowerUp]);

  const handleEnqueueAutomation = useCallback(async () => {
    const sources = [techPowerUp, passMark, geekBench].filter(
      (source) => source != null,
    );

    await automationService.enqueue({
      action: AutomationAction.FetchCpuData,
      description: `Create CPU: ${preferredName}`,
      data: { preferredName, sources } as FetchCpuDataAction,
    });

    await handleArchive();
  }, [geekBench, handleArchive, passMark, preferredName, techPowerUp]);

  return (
    <Card>
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xs">{subtitle}</span>
          <CardTitle>{preferredName}</CardTitle>
        </div>

        <div className="flex flex-1 gap-4">
          <ProductAutocomplete
            productType={ProductType.Cpu}
            onChange={setAppliedCpuId}
          />
          <Button
            variant={ButtonVariant.Generic}
            disabled={appliedCpuId == null}
            onClick={handleApplyToCpu}
          >
            Apply to CPU
          </Button>
        </div>
      </div>
      <CardContent>
        <Field className="flex-1">
          <div className="flex justify-between">CPU Name</div>
          <TextInput value={preferredName} onChange={setPreferredName} />
          <FieldHint>
            This will be used as the CPU&apos;s name when it is created.
          </FieldHint>
        </Field>

        <div className="flex gap-4 items-center">
          <Field className="flex-1">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span>TechPowerUp</span>
                {techPowerUp != null && (
                  <a
                    href={techPowerUp.sourceUrl}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                  </a>
                )}
              </div>

              {techPowerUp != null && (
                <FieldOptional>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetNameFromSource(techPowerUp);
                    }}
                    className="cursor-pointer"
                  >
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <ProductSourceAutocomplete
                productType={ProductType.Cpu}
                source={CpuDataSourceKey.TechPowerUp}
                value={techPowerUp}
                onChange={setTechPowerUp}
              />
              <TextInput value={techPowerUp?.sourceUrl} disabled />
            </div>
            <div className="flex justify-between">
              <FieldHint>{techPowerUpHint}</FieldHint>
              <Checkbox
                disabled={techPowerUp == null}
                value={techPowerUp?.archived ?? false}
                onChange={(checked) =>
                  handleArchiveToggle(CpuDataSourceKey.TechPowerUp, checked)
                }
              >
                Archive?
              </Checkbox>
            </div>
          </Field>
          <Field className="flex-1">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span>PassMark</span>
                {passMark != null && (
                  <a
                    href={passMark.sourceUrl}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                  </a>
                )}
              </div>

              {passMark != null && (
                <FieldOptional>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetNameFromSource(passMark);
                    }}
                    className="cursor-pointer"
                  >
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <ProductSourceAutocomplete
                productType={ProductType.Cpu}
                source={CpuDataSourceKey.PassMark}
                value={passMark}
                onChange={setPassMark}
              />
              <TextInput value={passMark?.sourceUrl} disabled />
            </div>
            <div className="flex justify-between">
              <FieldHint>{passMarkHint}</FieldHint>
              <Checkbox
                disabled={passMark == null}
                value={passMark?.archived ?? false}
                onChange={(checked) =>
                  handleArchiveToggle(CpuDataSourceKey.PassMark, checked)
                }
              >
                Archive?
              </Checkbox>
            </div>
          </Field>
          <Field className="flex-1">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span>GeekBench</span>
                {geekBench != null && (
                  <a
                    href={geekBench.sourceUrl}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                  </a>
                )}
              </div>

              {geekBench != null && (
                <FieldOptional>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetNameFromSource(geekBench);
                    }}
                    className="cursor-pointer"
                  >
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <ProductSourceAutocomplete
                productType={ProductType.Cpu}
                source={CpuDataSourceKey.GeekBench}
                value={geekBench}
                onChange={setGeekBench}
              />
              <TextInput value={geekBench?.sourceUrl} disabled />
            </div>
            <div className="flex justify-between">
              <FieldHint>{geekBenchHint}</FieldHint>
              <Checkbox
                disabled={geekBench == null}
                value={geekBench?.archived ?? false}
                onChange={(checked) =>
                  handleArchiveToggle(CpuDataSourceKey.GeekBench, checked)
                }
              >
                Archive?
              </Checkbox>
            </div>
          </Field>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant={ButtonVariant.Generic} onClick={handleArchive}>
            Save Sources
          </Button>
          <Button
            variant={ButtonVariant.Generic}
            onClick={handleEnqueueAutomation}
          >
            Enqueue CPU Creation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
