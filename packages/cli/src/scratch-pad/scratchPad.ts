import { getDatabase } from '../shared/database';

export async function scratchPad() {
  // const db = await getDatabase();
  //
  // await db.$transaction(
  //   async () => {
  //     const gpuFields = await db.gpuFields.findMany({
  //       include: { product: { include: { parent: true } } },
  //     });
  //     for (const gpuField of gpuFields) {
  //       const company =
  //         gpuField.product.parent?.company || gpuField.product.company;
  //       const lcCompany = company?.toLowerCase();
  //       if (lcCompany === 'intel') {
  //         console.log(`Updating Intel product: ${gpuField.product.name}`);
  //         await db.gpuFields.update({
  //           data: {
  //             executionUnitsValue: gpuField.computeUnitsValue,
  //             executionUnitsMeta: {
  //               ...(gpuField.computeUnitsMeta as any),
  //               fieldKey: 'executionUnits',
  //             },
  //             shadingUnitsValue: gpuField.gpuCoresValue,
  //             shadingUnitsMeta: {
  //               ...(gpuField.gpuCoresMeta as any),
  //               fieldKey: 'shadingUnits',
  //             },
  //             computeUnitsValue: null,
  //             computeUnitsMeta: null,
  //             gpuCoresValue: null,
  //             gpuCoresMeta: null,
  //           },
  //           where: { id: gpuField.id },
  //         });
  //       } else if (lcCompany === 'amd') {
  //         console.log(`Updating AMD product: ${gpuField.product.name}`);
  //         await db.gpuFields.update({
  //           data: {
  //             streamProcessorsValue: gpuField.gpuCoresValue,
  //             streamProcessorsMeta: {
  //               ...(gpuField.gpuCoresMeta as any),
  //               fieldKey: 'streamProcessors',
  //             },
  //             gpuCoresValue: null,
  //             gpuCoresMeta: null,
  //           },
  //           where: { id: gpuField.id },
  //         });
  //       } else if (lcCompany === 'ati') {
  //         console.log(`Updating ATI product: ${gpuField.product.name}`);
  //         await db.gpuFields.update({
  //           data: {
  //             shadingUnitsValue: gpuField.gpuCoresValue,
  //             shadingUnitsMeta: {
  //               ...(gpuField.gpuCoresMeta as any),
  //               fieldKey: 'shadingUnits',
  //             },
  //             gpuCoresValue: null,
  //             gpuCoresMeta: null,
  //           },
  //           where: { id: gpuField.id },
  //         });
  //       } else if (lcCompany === 'nvidia') {
  //         console.log(`Updating NVIDIA product: ${gpuField.product.name}`);
  //         await db.gpuFields.update({
  //           data: {
  //             streamMultiprocessorsValue: gpuField.computeUnitsValue,
  //             streamMultiprocessorsMeta: {
  //               ...(gpuField.computeUnitsMeta as any),
  //               fieldKey: 'streamMultiprocessors',
  //             },
  //             cudaCoresValue: gpuField.gpuCoresValue,
  //             cudaCoresMeta: {
  //               ...(gpuField.gpuCoresMeta as any),
  //               fieldKey: 'cudaCores',
  //             },
  //             computeUnitsValue: null,
  //             computeUnitsMeta: null,
  //             gpuCoresValue: null,
  //             gpuCoresMeta: null,
  //           },
  //           where: { id: gpuField.id },
  //         });
  //       }
  //     }
  //   },
  //   { timeout: 1000 * 60 * 15 },
  // );
}
