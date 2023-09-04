// import { CpuRepository, mapToCpuDto, mapToCpuEntity } from '@pcpartdb/database';
// import { CpuFields, ListCpusOrder, ListCpusSort } from '@pcpartdb/shared';
// import { getDatabase } from '../shared/database';

export async function scratchPad() {
  // const db = await getDatabase();
  // const cpuRepository = new CpuRepository(db);
  // const totalCpus = await db.transaction(async (trx) => {
  //   const ctx = { trx };
  //   return await cpuRepository.count({}, ctx);
  // });
  // for (let i = 0; i < totalCpus; i += 10) {
  //   await db.transaction(
  //     async (trx) => {
  //       const ctx = { trx };
  //       const cpus = await cpuRepository.list(
  //         {
  //           query: {
  //             pagination: { offset: i, limit: 10 },
  //             orderBy: { sort: ListCpusSort.Id, order: ListCpusOrder.Asc },
  //           },
  //         },
  //         ctx,
  //       );
  //       for (let j = 0; j < cpus.length; ++j) {
  //         const cpuEntity = cpus[j];
  //         const cpu = mapToCpuDto(cpuEntity, { includeSources: true });
  //         console.log(
  //           `${cpu.id}: ${JSON.stringify(cpu.marketSegments, undefined, 2)}`,
  //         );
  //         const value = cpu.marketSegments?.value?.[0] || null;
  //         const meta = {
  //           ...(cpu.marketSegments?.meta ?? {}),
  //           fieldKey: 'marketSegment' as keyof CpuFields,
  //         };
  //         cpu.marketSegment = { value, meta };
  //         console.log(cpu.marketSegment);
  //         const data = mapToCpuEntity(cpu);
  //         await cpuRepository.update(cpu.id, data, ctx);
  //       }
  //       console.log(`Finished updating cpus ${i} - ${i + 9}`);
  //     },
  //     { timeout: 20_000 },
  //   );
  // }
}
