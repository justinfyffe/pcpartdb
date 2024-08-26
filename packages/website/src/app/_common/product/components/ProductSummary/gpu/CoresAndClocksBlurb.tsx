'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const CoresAndClocksTitle = compileContentComponent(
  {
    tags: [SpecsTag.CudaCores],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.ShadingUnits],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.StreamProcessors],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.StreamMultiprocessors],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.ExecutionUnits],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.ComputeUnits],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.CoreClockBase],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.Tmus],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.Rops],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.AiAccelerators],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.TensorCores],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.XeMatrixExtensions],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.RayAccelerators],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.RayTracingUnits],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.RtCores],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
);

const CoresAndClocksSentence1 = compileContentComponent(
  {
    // GPU with Cuda Cores (NVIDIA)
    tags: [SpecsTag.CudaCores],
    deps: ['cudaCores'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} includes {props.cudaCores}{' '}
          CUDA cores, the processing units for handling parallel computing
          tasks.
        </>
      );
    },
  },
  {
    // GPU with Shading Units (Intel)
    tags: [SpecsTag.ShadingUnits],
    deps: ['shadingUnits'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} includes{' '}
          {props.shadingUnits} shading units, the processing units for handling
          parallel computing tasks.
        </>
      );
    },
  },
  {
    // GPU with Stream Processors (AMD)
    tags: [SpecsTag.StreamProcessors],
    deps: ['streamProcessors'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} includes{' '}
          {props.streamProcessors} stream processors (SPs), the processing units
          for handling parallel computing tasks.
        </>
      );
    },
  },
);

const CoresAndClocksSentence2 = compileContentComponent(
  {
    // GPU with Core Clock, Boost Clock, and Game Clock
    tags: [
      SpecsTag.CoreClockBase,
      SpecsTag.CoreClockBoost,
      SpecsTag.CoreClockGame,
    ],
    deps: ['coreClock', 'coreBoostClock', 'gpuCoreGameClock'],
    Component: (props) => {
      return (
        <>
          The GPU operates at a core clock speed of {props.coreClock} and can
          dynamically boost its clock speed up to {props.coreBoostClock}. It
          usually operates at {props.gpuCoreGameClock} during typical gaming
          workloads.
        </>
      );
    },
  },
  {
    // GPU with Core Clock, and Game Clock
    tags: [SpecsTag.CoreClockBase, SpecsTag.CoreClockGame],
    deps: ['coreClock', 'gpuCoreGameClock'],
    Component: (props) => {
      return (
        <>
          The GPU operates at a core clock speed of {props.coreClock} and
          usually runs at {props.gpuCoreGameClock} during typical gaming
          workloads.
        </>
      );
    },
  },
  {
    // GPU with Core Clock and Boost Clock
    tags: [SpecsTag.CoreClockBase, SpecsTag.CoreClockBoost],
    deps: ['coreClock', 'coreBoostClock'],
    Component: (props) => {
      return (
        <>
          The GPU operates at a core clock speed of {props.coreClock} and can
          dynamically boost its clock speed up to {props.coreBoostClock}.
        </>
      );
    },
  },
  {
    // GPU with Core Clock
    tags: [SpecsTag.CoreClockBase],
    deps: ['coreClock'],
    Component: (props) => {
      return <>The GPU operates at a core clock speed of {props.coreClock}.</>;
    },
  },
);

const CoresAndClocksSentence3 = compileContentComponent(
  {
    // GPU with TMUs and ROPs
    tags: [SpecsTag.Tmus, SpecsTag.Rops],
    deps: ['tmus', 'rops'],
    Component: (props) => {
      return (
        <>
          Complementing the processing units are {props.tmus} texture mapping
          units (TMUs) for efficient texture filtering and {props.rops} render
          output units (ROPs) for pixel processing.
        </>
      );
    },
  },
  {
    // GPU with TMUs
    tags: [SpecsTag.Tmus],
    deps: ['tmus'],
    Component: (props) => {
      return (
        <>
          Complementing the processing units are {props.tmus} texture mapping
          units (TMUs) for efficient texture filtering.
        </>
      );
    },
  },
  {
    // GPU with ROPs
    tags: [SpecsTag.Rops],
    deps: ['rops'],
    Component: (props) => {
      return (
        <>
          Complementing the processing units are {props.rops} render output
          units (ROPs) for prixel processing.
        </>
      );
    },
  },
);

const CoresAndClocksSentence4 = compileContentComponent(
  {
    // (NVIDIA) GPU with Tensor Cores and RT Cores
    tags: [SpecsTag.TensorCores, SpecsTag.RtCores],
    deps: ['tensorCores', 'rtCores'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.tensorCores} tensor cores
          optimized for AI-accelerated workloads and {props.rtCores} RT cores
          dedicated to real-time ray tracing calculations.
        </>
      );
    },
  },
  {
    // GPU with Tensor Cores
    tags: [SpecsTag.TensorCores],
    deps: ['tensorCores'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.tensorCores} tensor cores
          optimized for AI-accelerated workloads.
        </>
      );
    },
  },
  {
    // GPU with RT Cores
    tags: [SpecsTag.RtCores],
    deps: ['rtCores'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.rtCores} RT cores dedicated to
          real-time ray tracing calculations.
        </>
      );
    },
  },
  {
    // (AMD) GPU with AI Accelerators and Ray Accelerators
    tags: [SpecsTag.AiAccelerators, SpecsTag.RayAccelerators],
    deps: ['aiAccelerators', 'rayAccelerators'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.aiAccelerators} AI accelerators
          optimized for AI workloads and {props.rayAccelerators} ray
          accelerators dedicated to real-time ray tracing calculations.
        </>
      );
    },
  },
  {
    // (AMD) GPU with AI Accelerators
    tags: [SpecsTag.AiAccelerators],
    deps: ['aiAccelerators'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.aiAccelerators} AI accelerators
          optimized for AI workloads.
        </>
      );
    },
  },
  {
    // (AMD) GPU with Ray Accelerators
    tags: [SpecsTag.RayAccelerators],
    deps: ['rayAccelerators'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.rayAccelerators} ray
          accelerators dedicated to real-time ray tracing calculations.
        </>
      );
    },
  },
  {
    // (Intel) GPU with AI Accelerators and Ray Accelerators
    tags: [SpecsTag.XeMatrixExtensions, SpecsTag.RayTracingUnits],
    deps: ['xeMatrixExtensions', 'rayTracingUnits'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.xeMatrixExtensions} Xe Matrix
          Extensions (XMX) optimized for AI workloads and{' '}
          {props.rayTracingUnits} ray tracing units dedicated to real-time ray
          tracing calculations.
        </>
      );
    },
  },
  {
    // (Intel) GPU with Xe Matrix Extensions
    tags: [SpecsTag.XeMatrixExtensions],
    deps: ['xeMatrixExtensions'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.xeMatrixExtensions} Xe Matrix
          Extensions (XMX) optimized for AI workloads.
        </>
      );
    },
  },
  {
    // (Intel) GPU with Ray Accelerators
    tags: [SpecsTag.RayTracingUnits],
    deps: ['rayTracingUnits'],
    Component: (props) => {
      return (
        <>
          Additionally, the GPU features {props.rayTracingUnits} ray tracing
          units dedicated to real-time ray tracing calculations.
        </>
      );
    },
  },
);

const CoresAndClocksParagraph = compileContentComponent(
  {
    tags: [SpecsTag.CudaCores],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.ShadingUnits],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.StreamProcessors],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.StreamMultiprocessors],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.ExecutionUnits],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.ComputeUnits],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.CoreClockBase],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.Tmus],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.Rops],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.AiAccelerators],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.TensorCores],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.XeMatrixExtensions],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.RayAccelerators],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.RayTracingUnits],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.RtCores],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
);

interface CoresAndClocksBlurbProps {
  index: number;
}

export const CoresAndClocksBlurb: FunctionComponent<
  CoresAndClocksBlurbProps
> = (props) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <CoresAndClocksTitle />
      <CoresAndClocksParagraph />
    </ContentProvider>
  );
};
