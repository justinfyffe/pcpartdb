import { ProductRepository } from '@pcpartdb/database';
import { BenchmarKey, ProductType } from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

interface Data {
  id: number;
  name: string;
  score: number;
  msrp?: number;
  scorePerMsrp?: number;
  benchmarks: Record<string, number>;
  estimates: Record<string, number>;
}

const GPU_REQUIRED_BENCHMARKS = [BenchmarKey.G3dMark, BenchmarKey.G2dMark];
const GPU_PERFORMANCE_BENCHMARKS = [BenchmarKey.G3dMark, BenchmarKey.G2dMark];
const GPU_WEIGHTS = {
  [BenchmarKey.G3dMark]: 1,
  [BenchmarKey.G2dMark]: 0,
};

export async function scratchPad() {
  const db = await getDatabase();
  const productRepository = new ProductRepository(db);

  const gpus = await productRepository.list({
    productType: ProductType.Gpu,
    filter: { isChipset: true },
    includeBenchmarks: true,
    includeFields: true,
  });

  const dataList: Data[] = gpus
    .filter((gpu) =>
      GPU_REQUIRED_BENCHMARKS.every((key) =>
        gpu.benchmarks.some((b) => b.benchmarkKey === key),
      ),
    )
    .map((gpu) => ({
      id: gpu.id,
      name: gpu.name,
      score: null,
      msrp: gpu.gpuFields?.msrpValue ?? null,
      benchmarks: gpu.benchmarks.reduce((acc, benchmark) => {
        acc[benchmark.benchmarkKey] = benchmark.value;
        return acc;
      }, {} as Record<string, number>),
      estimates: {},
    }));

  const maxes = calculateMaxes(dataList, GPU_PERFORMANCE_BENCHMARKS);

  for (const data of dataList) {
    const existingKeys = GPU_PERFORMANCE_BENCHMARKS.filter(
      (key) => data.benchmarks[key] != null,
    );
    const missingKeys = GPU_PERFORMANCE_BENCHMARKS.filter(
      (key) => data.benchmarks[key] == null,
    );

    for (const missingKey of missingKeys) {
      data.estimates[missingKey] = predictScore(
        data,
        dataList,
        missingKey,
        existingKeys,
        maxes,
        GPU_WEIGHTS,
      );
    }
  }

  calculateScore(dataList, GPU_PERFORMANCE_BENCHMARKS, maxes, GPU_WEIGHTS);
  const sortedData = dataList.sort((d1, d2) => d2.score - d1.score);
  sortedData.forEach((value) => {
    console.log(
      `${value.name},${value.score},${
        value.benchmarks[BenchmarKey.G3dMark] ?? ''
      },${value.benchmarks[BenchmarKey.G2dMark] ?? ''},${
        value.benchmarks[BenchmarKey.TimespyGraphics] ?? ''
      },${value.estimates[BenchmarKey.TimespyGraphics] ?? ''}`,
    );
  });

  console.log('\n\n\n');

  const sortedByValue = dataList
    .filter((d) => d.scorePerMsrp != null)
    .sort((d1, d2) => (d2.scorePerMsrp || 0) - (d1.scorePerMsrp || 0));
  sortedByValue.forEach((value) => {
    console.log(
      `${value.name}: ${value.scorePerMsrp} = ${value.score ?? ''} / ${
        value.msrp ?? ''
      }`,
    );
  });
}

function calculateMaxes(dataList: Data[], benchmarks: BenchmarKey[]) {
  const maxes: Partial<Record<BenchmarKey, number>> = {};
  for (const data of dataList) {
    for (const benchmark of benchmarks) {
      maxes[benchmark] = Math.max(
        maxes[benchmark] || 0,
        data.benchmarks[benchmark] || 0,
      );
    }
  }
  return maxes;
}

function predictScore(
  dataToFix: Data,
  dataList: Data[],
  missingKey: BenchmarKey,
  existingKeys: BenchmarKey[],
  maxes: Partial<Record<BenchmarKey, number>>,
  weights: Partial<Record<BenchmarKey, number>>,
) {
  let maxScore = 0;
  const scores: { data: Data; score: number }[] = [];
  for (const data of dataList) {
    if (!hasBenchmarks(data, existingKeys, false)) {
      continue;
    }

    scores[data.id] = { score: 0, data };
    for (const key of existingKeys) {
      scores[data.id].score += getBenchmarkScore(
        data,
        key,
        maxes,
        weights,
        false,
      );
    }

    maxScore = Math.max(scores[data.id].score, maxScore);
  }
  scores.forEach((value) => {
    value.score = value.score / maxScore;
  });
  scores.sort((v1, v2) => v2.score - v1.score);

  let idx = scores.findIndex((v) => v.data.id === dataToFix.id);
  if (idx === -1) {
    throw new Error('this shouldnt happen');
  }

  idx = idx + 1;
  let counter = 0;
  while (idx < scores.length) {
    counter++;
    if (scores?.[idx]?.data.benchmarks[missingKey] != null) {
      console.log(
        `Estimated ${scores[idx].data.benchmarks[missingKey]} for ${missingKey} on ${dataToFix.name}. Off by ${counter}`,
      );
      return scores[idx].data.benchmarks[missingKey];
    }
    idx++;
  }

  // Could not find score. assume 0.
  return 0;
}

function calculateScore(
  dataList: Data[],
  benchmarkKeys: BenchmarKey[],
  maxes: Record<string, number>,
  weights: Record<string, number>,
) {
  let maxScore = 0;
  let maxScorePerMsrp = 0;
  for (const data of dataList) {
    if (!hasBenchmarks(data, benchmarkKeys, true)) {
      continue;
    }

    data.score = 0;
    for (const key of benchmarkKeys) {
      data.score += getBenchmarkScore(data, key, maxes, weights, true);
    }

    maxScore = Math.max(maxScore, data.score);

    if (data.msrp != null) {
      data.scorePerMsrp = data.score / data.msrp;
      maxScorePerMsrp = Math.max(maxScorePerMsrp, data.scorePerMsrp);
    }
  }
  for (const data of dataList) {
    data.score = (data.score / maxScore) * 100;
    if (data.scorePerMsrp != null) {
      data.scorePerMsrp = (data.scorePerMsrp / maxScorePerMsrp) * 100;
    }
  }
}

function getBenchmarkScore(
  data: Data,
  key: BenchmarKey,
  maxes: Record<string, number>,
  weights: Record<string, number>,
  useEstimates: boolean,
) {
  if (useEstimates && data.estimates[key]) {
    return data.estimates[key];
  }

  const benchmark = data.benchmarks[key] || 0;
  const benchmarkMax = maxes[key];
  const benchmarkWeight = weights[key];
  return (benchmark / benchmarkMax) * benchmarkWeight;
}

function hasBenchmarks(
  data: Data,
  keys: BenchmarKey[],
  checkEstimates: boolean,
) {
  for (const key of keys) {
    const missingEstimate = checkEstimates ? data.estimates[key] == null : true;

    if (!missingEstimate && data.benchmarks[key] == null) {
      return false;
    }
  }

  return true;
}

// function calculateScores(
//   dataList: Data[],
//   benchmarkKeys: BenchmarKey[],
//   maxes: Record<string, number>,
//   weights: Record<string, number>,
// ) {
//   let maxScore = 0;
//   for (const data of dataList) {
//     const g3d = data.benchmarks[BenchmarKey.G3dMark] || 0;
//     const g3dMax = maxes[BenchmarKey.G3dMark];
//     const g3dWeight = weights[BenchmarKey.G3dMark];
//     const g3dScore = (g3d / g3dMax) * g3dWeight;

//     const g2d = data.benchmarks[BenchmarKey.G2dMark] || 0;
//     const g2dMax = maxes[BenchmarKey.G2dMark];
//     const g2dWeight = weights[BenchmarKey.G2dMark];
//     const g2dScore = (g2d / g2dMax) * g2dWeight;

//     data.score = g3dScore + g2dScore;
//     maxScore = Math.max(maxScore, data.score);
//   }
//   for (const data of dataList) {
//     data.score = (data.score / maxScore) * 100;
//   }
// }
