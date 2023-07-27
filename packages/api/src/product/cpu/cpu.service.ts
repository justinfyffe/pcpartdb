import { Injectable } from '@nestjs/common';
import {
  CountCpusOptions,
  ListCpusOptions,
  mapToCpuDto,
  mapToCpuDtos,
  mapToCpuEntity,
} from '@pcpartdb/database';
import {
  Cpu,
  CpuComparison,
  CpuDataSourceKey,
  CpuFieldKey,
  CpuMeta,
  CpuRank,
  CreateCpuRequest,
  populateCpuPerformanceScoreBenchmark,
  populateCpuValueScoreBenchmark,
  ProductDataUpdate,
  ProductSourceGroup,
  UpdateCpuRequest,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { Context } from '../../shared/context';
import { badRequestError, notFoundError } from '../../shared/error';
import { CpuRepository } from './cpu.repository';
import { CpuRanksService } from './ranks/cpu-ranks.service';

interface ListOptions extends ListCpusOptions {
  fields?: CpuFieldKey[];
  includeRanks?: CpuRank[];
}

interface GetOptions {
  includeImages?: boolean;
  includeRanks?: CpuRank[];
}

interface GetComparisonOptions {
  slug?: string;

  includeImages?: boolean;
  includeRanks?: CpuRank[];
}

@Injectable()
export class CpuService {
  constructor(
    private cpuRepository: CpuRepository,
    private cpuRanksService: CpuRanksService,
  ) {}

  async count(options: CountCpusOptions, ctx: Context) {
    return await this.cpuRepository.count(options, ctx);
  }

  async list(options: ListOptions, ctx: Context) {
    const cpuEntities = await this.cpuRepository.list(options, ctx);

    const fields = options.fields != null ? new Set(options.fields) : null;
    const cpus: Cpu[] = mapToCpuDtos(cpuEntities, {
      fields,
      includeSources: ctx.user?.isStaff,
    });

    if (options.includeRanks) {
      await this.cpuRanksService.populateRanks(options.includeRanks, cpus, ctx);
    }

    return cpus;
  }

  async getById(id: number, options: GetOptions, ctx: Context) {
    const cpuEntity = await this.cpuRepository.findById(id, options, ctx);
    const cpu = mapToCpuDto(cpuEntity, {
      includeSources: ctx.user?.isStaff,
    });

    if (cpu == null) {
      throw notFoundError({ cpu: id });
    }
    if (options?.includeRanks) {
      await this.cpuRanksService.populateRanks(
        options.includeRanks,
        [cpu],
        ctx,
      );
    }

    return cpu;
  }

  async getBySlug(slug: string, options: GetOptions, ctx: Context) {
    const cpuEntity = await this.cpuRepository.findBySlug(slug, options, ctx);
    const cpu = mapToCpuDto(cpuEntity, {
      includeSources: ctx.user?.isStaff,
    });

    if (cpu == null) {
      throw notFoundError({ gpu: slug });
    }
    if (options.includeRanks) {
      await this.cpuRanksService.populateRanks(
        options.includeRanks,
        [cpu],
        ctx,
      );
    }

    return cpu;
  }

  async getComparison(options: GetComparisonOptions, ctx: Context) {
    const { slug } = options;
    const slugs = slug.split('--vs--');

    if (slugs.length !== 2) {
      throw notFoundError({ comparison: slug });
    } else if (slugs[0] === slugs[1]) {
      throw notFoundError({ comparison: slug });
    }

    const cpus: Cpu[] = [];
    for (const slugItem of slugs) {
      const cpu = await this.getBySlug(
        slugItem,
        {
          includeImages: options.includeImages,
          includeRanks: options.includeRanks || null,
        },
        ctx,
      );

      if (cpu != null) {
        cpus.push(cpu);
      }
    }

    return cpus as CpuComparison;
  }

  async create(data: CreateCpuRequest, ctx: Context) {
    // Check if another part exists at the slug
    const existingGpu = await this.cpuRepository.findBySlug(data.slug, {}, ctx);
    if (existingGpu != null) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_CPU_AT_SLUG',
      });
    }

    populateCpuPerformanceScoreBenchmark(data);
    populateCpuValueScoreBenchmark(data);

    const entity = mapToCpuEntity({ id: undefined, ...data });
    const result = await this.cpuRepository.create(entity, ctx);
    return mapToCpuDto(result);
  }

  async update(id: number, data: UpdateCpuRequest, ctx: Context) {
    // Check if another gpu exists at the slug
    const existingCpu = await this.cpuRepository.findBySlug(data.slug, {}, ctx);
    if (existingCpu != null && existingCpu.id !== id) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_CPU_AT_SLUG',
      });
    }

    const cpu = await this.cpuRepository.findById(id, {}, ctx);
    if (cpu == null) {
      throw notFoundError({ cpu: id });
    }

    populateCpuPerformanceScoreBenchmark(data);
    populateCpuValueScoreBenchmark(data);

    const entity = mapToCpuEntity({ id: undefined, ...data });
    const result = await this.cpuRepository.update(id, entity, ctx);
    return mapToCpuDto(result);
  }

  async delete(id: number, ctx: Context) {
    const cpu = await this.cpuRepository.findById(id, {}, ctx);
    if (cpu == null) {
      throw notFoundError({ cpu: id });
    }

    await this.cpuRepository.delete(id, ctx);
    return id;
  }

  async applyDataUpdate(dataUpdate: ProductDataUpdate, ctx: Context) {
    const updated = dataUpdate.data.updated as Cpu;
    await this.update(dataUpdate.cpuId, updated, ctx);
  }

  async applySources(id: number, sources: ProductSourceGroup, ctx: Context) {
    const cpu = await this.getById(id, {}, ctx);

    // Extract URLs from new sources
    const techPowerUpUrl = sources.filter(
      (source) => source.sourceKey === CpuDataSourceKey.TechPowerUp,
    )[0]?.sourceUrl;
    const passMarkUrl = sources.filter(
      (source) => source.sourceKey === CpuDataSourceKey.PassMark,
    )[0]?.sourceUrl;
    const geekBenchUrl = sources.filter(
      (source) => source.sourceKey === CpuDataSourceKey.GeekBench,
    )[0]?.sourceUrl;

    // Extract data sources from existing cpu
    const techPowerUp = cpu.meta?.dataSources?.[CpuDataSourceKey.TechPowerUp];
    const passMark = cpu.meta?.dataSources?.[CpuDataSourceKey.PassMark];
    const geekBench = cpu.meta?.dataSources?.[CpuDataSourceKey.GeekBench];

    // Merge - We don't want to delete sources, only overwrite them.
    cpu.meta = deepmerge(cpu.meta, {
      dataSources: {
        [CpuDataSourceKey.TechPowerUp]: {
          url: techPowerUpUrl || techPowerUp?.url,
        },
        [CpuDataSourceKey.PassMark]: { url: passMarkUrl || passMark?.url },
        [CpuDataSourceKey.GeekBench]: { url: geekBenchUrl || geekBench?.url },
      },
    } as CpuMeta);

    await this.update(id, cpu, ctx);
  }
}
