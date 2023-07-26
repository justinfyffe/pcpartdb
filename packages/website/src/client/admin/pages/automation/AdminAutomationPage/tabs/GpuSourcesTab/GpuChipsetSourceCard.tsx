import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CreateGpuActionData,
  GpuDataSourceKey,
  GpuProductSource,
  GpuProductSourceGroup,
  Product,
  ProductSource,
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
  showDialog,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import React, { useCallback, useMemo, useState } from 'react';
import { PickSourceDialog } from '../../components/PickSourceDialog';

interface GpuChipsetSourceCardProps {
  sources: GpuProductSourceGroup;
}

export const GpuChipsetSourceCard = (props: GpuChipsetSourceCardProps) => {
  const { sources } = props;

  // States & Memos

  const [expanded, setExpanded] = useState(false);

  const techPowerUpSources = useMemo(
    () =>
      sources.filter(
        (source) => source.sourceKey === GpuDataSourceKey.TechPowerUp,
      ),
    [sources],
  );
  const [techPowerUp, setTechPowerUp] = useState(techPowerUpSources[0] || null);

  const passMarkSources = useMemo(
    () =>
      sources.filter(
        (source) => source.sourceKey === GpuDataSourceKey.VideocardBenchmarks,
      ),
    [sources],
  );
  const [passMark, setPassMark] = useState(passMarkSources[0] || null);

  const ulBenchmarkSources = useMemo(
    () =>
      sources.filter(
        (source) => source.sourceKey === GpuDataSourceKey.UlBenchmarks,
      ),
    [sources],
  );
  const [ulBenchmark, setUlBenchmark] = useState(ulBenchmarkSources[0] || null);

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

  const [archiveTechPowerUp, setArchiveTechPowerUp] = useState(!!techPowerUp);
  const [archivePassMark, setArchivePassMark] = useState(!!passMark);
  const [archiveUlBenchmark, setArchiveUlBenchmark] = useState(!!ulBenchmark);

  const [preferredName, setPreferredName] = useState(
    () => sources[0].sourceName,
  );
  const [appliedGpu, setAppliedGpu] = useState<Product>(null);
  const [groupKey] = useState(
    () => techPowerUp?.groupKey || passMark?.groupKey || ulBenchmark?.groupKey,
  );

  const sourcesList = useMemo(
    () =>
      [
        techPowerUp
          ? `TechPowerUp${
              techPowerUpSources.length > 1
                ? ` (x${techPowerUpSources.length})`
                : ''
            }`
          : null,
        passMark
          ? `PassMark${
              passMarkSources.length > 1 ? ` (x${passMarkSources.length})` : ''
            }`
          : null,
        ulBenchmark
          ? `UL Benchmarks${
              ulBenchmarkSources.length > 1
                ? ` (x${ulBenchmarkSources.length})`
                : ''
            }`
          : null,
      ]
        .filter((source) => source != null)
        .join(', '),
    [
      passMark,
      passMarkSources.length,
      techPowerUp,
      techPowerUpSources.length,
      ulBenchmark,
      ulBenchmarkSources.length,
    ],
  );

  // Callbacks

  const setNameFromSource = useCallback((source: GpuProductSource) => {
    const name = source.sourceName;
    setPreferredName(name);
  }, []);

  const save = useCallback(async () => {
    const newTechPowerUp: GpuProductSource =
      techPowerUp != null
        ? {
            ...techPowerUp,
            archived: archiveTechPowerUp,
          }
        : null;
    const newPassMark: GpuProductSource =
      passMark != null
        ? {
            ...passMark,
            archived: archivePassMark,
          }
        : null;
    const newUlBenchmark: GpuProductSource =
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
    techPowerUp,
    archiveTechPowerUp,
    passMark,
    archivePassMark,
    ulBenchmark,
    archiveUlBenchmark,
  ]);

  const setTechPowerUpFromAutocomplete = useCallback(
    (source: ProductSource) => {
      setTechPowerUp(source as GpuProductSource);
      setArchiveTechPowerUp(!!source);
    },
    [],
  );
  const setPassMarkFromAutocomplete = useCallback((source: ProductSource) => {
    setPassMark(source as GpuProductSource);
    setArchivePassMark(!!source);
  }, []);
  const setUlBenchmarkFromAutocomplete = useCallback(
    (source: ProductSource) => {
      setUlBenchmark(source as GpuProductSource);
      setArchiveUlBenchmark(!!source);
    },
    [],
  );

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
      data: { preferredName, sources, chipsetId: null } as CreateGpuActionData,
    });

    // Update sources to archive them.
    await save();
  }, [ulBenchmark, save, passMark, preferredName, techPowerUp]);

  const showPickSourceDialog = useCallback(
    (
      sources: ProductSource[],
      currentSource: ProductSource,
      setter: (value: GpuProductSource) => void,
    ) => {
      if (sources.length === 0) {
        return;
      }

      showDialog(
        <PickSourceDialog
          currentSource={currentSource}
          sources={sources}
          onSelected={(selected) => setter(selected as GpuProductSource)}
        />,
      );
    },
    [],
  );

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

          <span className="text-xs">
            <span className="font-semibold">Grouping:</span> {groupKey}
          </span>
          <span className="text-xs">
            <span className="font-semibold">Sources:</span> {sourcesList}
          </span>
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
                  <div>
                    TechPowerUp{' '}
                    {techPowerUpSources.length > 1 ? (
                      <>(x{techPowerUpSources.length})</>
                    ) : (
                      <></>
                    )}
                  </div>
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

                <FieldOptional className="flex gap-2">
                  {techPowerUpSources.length > 0 && (
                    <>
                      <a
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          showPickSourceDialog(
                            techPowerUpSources,
                            techPowerUp,
                            setTechPowerUp,
                          );
                        }}
                      >
                        picker
                      </a>

                      {techPowerUp != null && <>&bull;</>}
                    </>
                  )}
                  {techPowerUp != null && (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setNameFromSource(techPowerUp);
                      }}
                      className="cursor-pointer"
                    >
                      use name
                    </a>
                  )}
                </FieldOptional>
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <ProductSourceAutocomplete
                  productType={ProductType.Gpu}
                  source={GpuDataSourceKey.TechPowerUp}
                  value={techPowerUp}
                  onChange={setTechPowerUpFromAutocomplete}
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
                  <div>
                    PassMark{' '}
                    {passMarkSources.length > 1 ? (
                      <>(x{passMarkSources.length})</>
                    ) : (
                      <></>
                    )}
                  </div>
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

                <FieldOptional className="flex gap-2">
                  {passMarkSources.length > 0 && (
                    <>
                      <a
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          showPickSourceDialog(
                            passMarkSources,
                            passMark,
                            setPassMark,
                          );
                        }}
                      >
                        picker
                      </a>

                      {passMark != null && <>&bull;</>}
                    </>
                  )}
                  {passMark != null && (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setNameFromSource(passMark);
                      }}
                      className="cursor-pointer"
                    >
                      use name
                    </a>
                  )}
                </FieldOptional>
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <ProductSourceAutocomplete
                  productType={ProductType.Gpu}
                  source={GpuDataSourceKey.VideocardBenchmarks}
                  value={passMark}
                  onChange={setPassMarkFromAutocomplete}
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
                  <div>
                    UL Benchmarks{' '}
                    {ulBenchmarkSources.length > 1 ? (
                      <>(x{ulBenchmarkSources.length})</>
                    ) : (
                      <></>
                    )}
                  </div>
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

                <FieldOptional className="flex gap-2">
                  {ulBenchmarkSources.length > 0 && (
                    <>
                      <a
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          showPickSourceDialog(
                            ulBenchmarkSources,
                            ulBenchmark,
                            setUlBenchmark,
                          );
                        }}
                      >
                        picker
                      </a>

                      {passMark != null && <>&bull;</>}
                    </>
                  )}
                  {passMark != null && (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setNameFromSource(ulBenchmark);
                      }}
                      className="cursor-pointer"
                    >
                      use name
                    </a>
                  )}
                </FieldOptional>
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <ProductSourceAutocomplete
                  productType={ProductType.Gpu}
                  source={GpuDataSourceKey.UlBenchmarks}
                  value={ulBenchmark}
                  onChange={setUlBenchmarkFromAutocomplete}
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
