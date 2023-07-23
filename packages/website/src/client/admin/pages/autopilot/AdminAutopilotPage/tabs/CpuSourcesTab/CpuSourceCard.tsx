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
  ProductSourceAutocomplete,
  productSourceService,
} from 'packages/website/src/client/product';
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

  const techPowerUpHint = useMemo(
    () =>
      techPowerUp != null
        ? `ID: ${techPowerUp.id} ${techPowerUp.archived ? '(Archived)' : ''}`
        : '',
    [techPowerUp],
  );
  const passMarkHint = useMemo(
    () =>
      passMark != null
        ? `ID: ${passMark.id} ${passMark.archived ? '(Archived)' : ''}`
        : '',
    [passMark],
  );
  const geekBenchHint = useMemo(
    () =>
      geekBench != null
        ? `ID: ${geekBench.id} ${geekBench.archived ? '(Archived)' : ''}`
        : '',
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
        techPowerUp.archived = value;
        setTechPowerUp(techPowerUp);
      } else if (key === CpuDataSourceKey.PassMark) {
        passMark.archived = value;
        setPassMark(passMark);
      } else if (key === CpuDataSourceKey.GeekBench) {
        geekBench.archived = value;
        setGeekBench(geekBench);
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
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <CardTitle>{preferredName}</CardTitle>
        </div>

        <div className="flex gap-4">
          <ProductAutocomplete
            productType={ProductType.Cpu}
            placeholder="Apply to CPU"
            onChange={setAppliedCpuId}
          />
          <Button
            variant={ButtonVariant.Generic}
            disabled={appliedCpuId == null}
            onClick={handleApplyToCpu}
          >
            Apply
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
              TechPowerUp
              {techPowerUp != null && (
                <FieldOptional>
                  <a
                    onClick={() => handleSetNameFromSource(techPowerUp)}
                    className="cursor-pointer"
                  >
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <ProductSourceAutocomplete
              productType={ProductType.Cpu}
              value={techPowerUp}
              onChange={setTechPowerUp}
            />
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
              PassMark
              {passMark != null && (
                <FieldOptional>
                  <a onClick={() => handleSetNameFromSource(passMark)}>
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <ProductSourceAutocomplete
              productType={ProductType.Cpu}
              value={passMark}
              onChange={setPassMark}
            />
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
              GeekBench
              {geekBench != null && (
                <FieldOptional>
                  <a onClick={() => handleSetNameFromSource(geekBench)}>
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <ProductSourceAutocomplete
              productType={ProductType.Cpu}
              value={geekBench}
              onChange={setGeekBench}
            />
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
            Skip
          </Button>
          <Button
            variant={ButtonVariant.Generic}
            onClick={handleEnqueueAutomation}
          >
            Enqueue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
