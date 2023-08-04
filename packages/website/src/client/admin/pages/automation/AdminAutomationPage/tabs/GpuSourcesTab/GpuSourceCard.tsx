import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CreateGpuActionData,
  GpuDataSourceKey,
  Product,
  ProductSource,
  ProductSourceGroup,
  ProductType,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import {
  formatProductName,
  ProductAutocomplete,
  productSourceService,
} from 'packages/website/src/client/product';
import { ProductSourceAutocomplete } from 'packages/website/src/client/product/components/ProductSourceAutocomplete';
import {
  Card,
  CardContent,
  CardTitle,
  Checkbox,
  Field,
  FieldHint,
  FieldOptional,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import React, { useCallback, useMemo, useState } from 'react';

interface GpuSourceCardProps {
  sources: ProductSourceGroup;
}

export const GpuSourceCard = (props: GpuSourceCardProps) => {
  const { sources } = props;

  // States

  const [expanded, setExpanded] = useState(false);

  // Extract each individual source from the group
  const [techPowerUp, setTechPowerUp] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === GpuDataSourceKey.TechPowerUp,
      )[0] || null
    );
  });
  const [passMark, setPassMark] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === GpuDataSourceKey.VideocardBenchmarks,
      )[0] || null
    );
  });
  const [ulBenchmark, setUlBenchmark] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === GpuDataSourceKey.UlBenchmarks,
      )[0] || null
    );
  });

  const [archiveTechPowerUp, setArchiveTechPowerUp] = useState(!!techPowerUp);
  const [archivePassMark, setArchivePassMark] = useState(!!passMark);
  const [archiveUlBenchmark, setArchiveUlBenchmark] = useState(!!ulBenchmark);

  const [preferredName, setPreferredName] = useState(
    () => sources[0].sourceName,
  );
  const [appliedGpu, setAppliedGpu] = useState<Product>(null);

  const techPowerUpId = techPowerUp?.id;
  const passMarkId = passMark?.id;
  const ulBenchmarkId = ulBenchmark?.id;
  const techPowerUpArchived = techPowerUp?.archived;
  const passMarkArchived = passMark?.archived;
  const ulBenchmarkArchived = ulBenchmark?.archived;
  const allArchived =
    (techPowerUpArchived ?? true) &&
    (passMarkArchived ?? true) &&
    (ulBenchmarkArchived ?? true);

  // Memos

  const subtitle = useMemo(
    () =>
      [
        techPowerUp ? 'TechPowerUp' : null,
        passMark ? 'PassMark' : null,
        ulBenchmark ? 'UL Benchmarks' : null,
      ]
        .filter((source) => source != null)
        .join(', '),
    [ulBenchmark, passMark, techPowerUp],
  );

  // Callbacks

  const setNameFromSource = useCallback((source: ProductSource) => {
    const name = source.sourceName;
    setPreferredName(name);
  }, []);

  const save = useCallback(async () => {
    const newTechPowerUp: ProductSource =
      techPowerUp != null
        ? {
            ...techPowerUp,
            archived: archiveTechPowerUp,
          }
        : null;
    const newPassMark: ProductSource =
      passMark != null
        ? {
            ...passMark,
            archived: archivePassMark,
          }
        : null;
    const newUlBenchmark: ProductSource =
      ulBenchmark != null
        ? {
            ...ulBenchmark,
            archived: archiveUlBenchmark,
          }
        : null;

    const sources = [newTechPowerUp, newPassMark, newUlBenchmark].filter(
      (source) => source != null && source.id != null,
    );

    await productSourceService.upsert({ sources: sources });

    await setTechPowerUp(newTechPowerUp);
    await setPassMark(newPassMark);
    await setUlBenchmark(newUlBenchmark);

    // Close the card
    await setExpanded(false);
  }, [
    archiveUlBenchmark,
    archivePassMark,
    archiveTechPowerUp,
    ulBenchmark,
    passMark,
    techPowerUp,
  ]);

  const applyToGpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, ulBenchmark]
      .filter((source) => source != null && source.id != null)
      .map((source) => source.id);

    // Add sources to existing product.
    await productSourceService.applyToProduct({
      productType: ProductType.Gpu,
      productId: appliedGpu.id,
      sources,
    });

    // Create automation action to update existing gpu.
    await automationService.createAction({
      type: AutomationActionType.UpdateGpu,
      description: formatProductName(ProductType.Gpu, appliedGpu),
      data: { gpuId: appliedGpu.id } as UpdateGpuActionData,
    });

    // Update sources
    await save();
  }, [techPowerUp, passMark, ulBenchmark, appliedGpu, save]);

  const createGpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, ulBenchmark].filter(
      (source) => source != null,
    );

    // Create automation action to create new GPU
    await automationService.createAction({
      type: AutomationActionType.CreateGpu,
      description: preferredName,
      data: { preferredName, sources } as CreateGpuActionData,
    });

    // Update sources to archive them.
    await save();
  }, [ulBenchmark, save, passMark, preferredName, techPowerUp]);

  // Render

  return (
    <Card>
      <div
        className="relative flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {allArchived && (
          <div className="absolute left-0 right-0 flex justify-center text-3xl text-dimmed">
            Archived
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <CardTitle>{preferredName}</CardTitle>
          <span className="text-xs">{subtitle}</span>
        </div>

        {expanded && <ChevronDownIcon className="w-8" />}
        {!expanded && <ChevronLeftIcon className="w-8" />}
      </div>

      {expanded && (
        <CardContent>
          <Field className="flex-1">
            <div className="flex justify-between">GPU Name</div>
            <TextInput value={preferredName} onChange={setPreferredName} />
            <FieldHint>
              This will be used as the GPU&apos;s name when it is created.
            </FieldHint>
          </Field>

          <div className="flex gap-4 items-start">
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
                        setNameFromSource(techPowerUp);
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
                  productType={ProductType.Gpu}
                  source={GpuDataSourceKey.TechPowerUp}
                  value={techPowerUp}
                  onChange={setTechPowerUp}
                />
                <TextInput value={techPowerUp?.sourceUrl} disabled />
              </div>
              {techPowerUp != null && (
                <div className="flex justify-between">
                  <FieldHint>
                    {techPowerUpId}:{' '}
                    {techPowerUpArchived ? <>Archived</> : <>Not Archived</>}
                  </FieldHint>
                  <Checkbox
                    disabled={techPowerUp == null}
                    value={archiveTechPowerUp}
                    onChange={(checked) => setArchiveTechPowerUp(checked)}
                  >
                    Archive
                  </Checkbox>
                </div>
              )}
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
                        setNameFromSource(passMark);
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
                  productType={ProductType.Gpu}
                  source={GpuDataSourceKey.VideocardBenchmarks}
                  value={passMark}
                  onChange={setPassMark}
                />
                <TextInput value={passMark?.sourceUrl} disabled />
              </div>
              {passMark != null && (
                <div className="flex justify-between">
                  <FieldHint>
                    {passMarkId}:{' '}
                    {passMarkArchived ? <>Archived</> : <>Not Archived</>}
                  </FieldHint>

                  <Checkbox
                    disabled={passMark == null}
                    value={archivePassMark}
                    onChange={(checked) => setArchivePassMark(checked)}
                  >
                    Archive
                  </Checkbox>
                </div>
              )}
            </Field>

            <Field className="flex-1">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <span>UL Benchmarks</span>
                  {ulBenchmark != null && (
                    <a
                      href={ulBenchmark.sourceUrl}
                      target="_blank"
                      rel="noreferrer nofollow"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                    </a>
                  )}
                </div>

                {ulBenchmark != null && (
                  <FieldOptional>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setNameFromSource(ulBenchmark);
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
                  productType={ProductType.Gpu}
                  source={GpuDataSourceKey.UlBenchmarks}
                  value={ulBenchmark}
                  onChange={setUlBenchmark}
                />
                <TextInput value={ulBenchmark?.sourceUrl} disabled />
              </div>
              {ulBenchmark != null && (
                <div className="flex justify-between">
                  <FieldHint>
                    {ulBenchmarkId}:{' '}
                    {ulBenchmarkArchived ? <>Archived</> : <>Not Archived</>}
                  </FieldHint>

                  <Checkbox
                    disabled={ulBenchmark == null}
                    value={archiveUlBenchmark}
                    onChange={(checked) => setArchiveUlBenchmark(checked)}
                  >
                    Archive
                  </Checkbox>
                </div>
              )}
            </Field>
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex flex-1 gap-4 max-w-[50%]">
              <ProductAutocomplete
                productType={ProductType.Gpu}
                onChangeProduct={setAppliedGpu}
              />
              <GenericButton disabled={appliedGpu == null} onClick={applyToGpu}>
                Apply
              </GenericButton>
            </div>

            <div className="flex gap-4">
              <GenericButton onClick={save}>Save</GenericButton>
              <GenericButton onClick={createGpu}>Create GPU</GenericButton>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
