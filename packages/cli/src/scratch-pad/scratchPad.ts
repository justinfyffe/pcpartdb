import { getDatabase } from '../shared/database';

export async function scratchPad() {
  const db = await getDatabase();

  await db.$transaction(
    async () => {
      const computeUnitsEmpty = await db.gpuFields.findMany({
        where: { computeUnitsValue: null },
      });
      for (const gpuField of computeUnitsEmpty) {
        console.log(`Updating Empty Compute Units: ${gpuField.productId}`);
        await db.gpuFields.update({
          data: {
            computeUnitsMeta: {
              fieldKey: 'computeUnits',
              autoUpdate: true,
              formattedValue: null,
            },
          },
          where: { id: gpuField.id },
        });
      }

      const cudaCoresEmpty = await db.gpuFields.findMany({
        where: { cudaCoresValue: null },
      });
      for (const gpuField of cudaCoresEmpty) {
        console.log(`Updating Empty Cuda Cores: ${gpuField.productId}`);
        await db.gpuFields.update({
          data: {
            cudaCoresMeta: {
              fieldKey: 'cudaCores',
              autoUpdate: true,
              formattedValue: null,
            },
          },
          where: { id: gpuField.id },
        });
      }

      const executionUnitsEmpty = await db.gpuFields.findMany({
        where: { executionUnitsValue: null },
      });
      for (const gpuField of executionUnitsEmpty) {
        console.log(`Updating Empty Execution Units: ${gpuField.productId}`);
        await db.gpuFields.update({
          data: {
            executionUnitsMeta: {
              fieldKey: 'executionUnits',
              autoUpdate: true,
              formattedValue: null,
            },
          },
          where: { id: gpuField.id },
        });
      }

      const shadingUnitsEmpty = await db.gpuFields.findMany({
        where: { shadingUnitsValue: null },
      });
      for (const gpuField of shadingUnitsEmpty) {
        console.log(`Updating Empty Shading Units: ${gpuField.productId}`);
        await db.gpuFields.update({
          data: {
            shadingUnitsMeta: {
              fieldKey: 'shadingUnits',
              autoUpdate: true,
              formattedValue: null,
            },
          },
          where: { id: gpuField.id },
        });
      }

      const streamMultiprocessorsEmpty = await db.gpuFields.findMany({
        where: { streamMultiprocessorsValue: null },
      });
      for (const gpuField of streamMultiprocessorsEmpty) {
        console.log(
          `Updating Empty Stream Multiprocessors: ${gpuField.productId}`,
        );
        await db.gpuFields.update({
          data: {
            streamMultiprocessorsMeta: {
              fieldKey: 'streamMultiprocessors',
              autoUpdate: true,
              formattedValue: null,
            },
          },
          where: { id: gpuField.id },
        });
      }

      const streamProcessorsEmpty = await db.gpuFields.findMany({
        where: { streamProcessorsValue: null },
      });
      for (const gpuField of streamProcessorsEmpty) {
        console.log(`Updating Empty Stream Processors: ${gpuField.productId}`);
        await db.gpuFields.update({
          data: {
            streamProcessorsMeta: {
              fieldKey: 'streamProcessors',
              autoUpdate: true,
              formattedValue: null,
            },
          },
          where: { id: gpuField.id },
        });
      }
    },
    { timeout: 1000 * 60 * 15 },
  );
}
