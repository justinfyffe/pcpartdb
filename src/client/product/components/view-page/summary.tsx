import { Content } from '@client/shared/content';
import { formatProductMeta } from '@shared/product-meta';
import { formatSpec } from '@shared/spec';
import React, { useContext, useMemo } from 'react';
import { ContentKey, introSentence1 } from './content';
import { ProductContext } from './product-context';

const HIGH_END_MIN = 650;
const MID_RANGE_MIN = 300;

interface SummaryProps {
  className?: string;
}

export const Summary = (props: SummaryProps) => {
  const { className } = props;

  return (
    <section className={className}>
      <p>
        <Content
          content={introSentence1}
          keys={{ [ContentKey.Released]: true }}
          params={{
            productName: 'Test GPU 1',
            marketSegment: 'Desktop',
            releaseDate: '12/12/12',
            company: 'AMD',
          }}
        />
      </p>
    </section>
  );

  // return (
  //   <section className={className}>
  //     <IntroParagraph />
  //     <MemoryParagraph />
  //     <CompatibilityParagraph />
  //     <CoresParagraph />
  //     <ConclusionParagraph />
  //   </section>
  // );
};

const IntroParagraph = () => {
  const { product, specs } = useContext(ProductContext);

  const sentence1 = useMemo(() => {
    const name = product.name;
    const company = formatSpec(specs.company);
    const releaseDate = formatSpec(specs.releaseDate);
    const msrp = formatSpec(specs.launchPrice);

    if (company && releaseDate && msrp) {
      return `The ${name} by ${company} has a release date of ${releaseDate} with a MSRP of ${msrp}. `;
    } else if (company && releaseDate) {
      return `The ${name} by ${company} has a release date of ${releaseDate}. `;
    } else if (company && msrp) {
      return `The ${name} by ${company} has a MSRP of ${msrp}. `;
    } else if (company) {
      return `The ${name} is a GPU by ${company}. `;
    } else if (releaseDate && msrp) {
      return `The ${name} has a release date of ${releaseDate} with a MSRP of ${msrp}. `;
    } else if (releaseDate) {
      return `The ${name} has a release date of ${releaseDate}. `;
    } else if (msrp) {
      return `The ${name} has a MSRP of ${msrp}. `;
    } else {
      return '';
    }
  }, [product, specs]);

  const sentence2 = useMemo(() => {
    const msrpValue = specs.launchPrice.value;
    const segment = formatSpec(specs.marketSegment);

    let msrpMarket = null;
    if (msrpValue != null) {
      if (msrpValue > HIGH_END_MIN) {
        msrpMarket = 'high-end';
      } else if (msrpValue > MID_RANGE_MIN) {
        msrpMarket = 'mid-range';
      } else {
        msrpMarket = 'budget';
      }
    }

    if (segment && msrpMarket) {
      return `This ${segment.toLowerCase()} graphics card is targeted towards the ${msrpMarket} market. `;
    } else if (segment) {
      return `This graphics card is built for ${segment.toLowerCase()}s `;
    } else if (msrpMarket) {
      return `This graphics card is targeted towards the ${msrpMarket} market. `;
    } else {
      return '';
    }
  }, [specs]);

  return (
    <p>
      {sentence1}
      {sentence2}
    </p>
  );
};

const MemoryParagraph = () => {
  const { specs } = useContext(ProductContext);

  const sentence1 = useMemo(() => {
    const architecture = formatSpec(specs.architecture);
    const memorySize = formatSpec(specs.memorySize);
    const memoryType = formatSpec(specs.memoryType);

    if (architecture && memorySize && memoryType) {
      return `The ${architecture} architecture GPU has ${memorySize} of ${memoryType} memory. `;
    } else if (architecture && memorySize) {
      return `The ${architecture} architecture GPU has ${memorySize} of memory. `;
    } else if (architecture && memoryType) {
      return `The ${architecture} GPU has ${memoryType} type of memory. `;
    } else if (memorySize && memoryType) {
      return `The GPU has ${memorySize} of ${memoryType} memory. `;
    } else if (memoryType) {
      return `The GPU has ${memoryType} type of memory. `;
    } else {
      return '';
    }
  }, [specs]);

  const sentence2 = useMemo(() => {
    const memoryClock = formatSpec(specs.memoryClock);
    const memoryBandwidth = formatSpec(specs.memoryBandwidth);
    const memoryInterface = formatSpec(specs.memoryInterface);

    if (memoryClock && memoryBandwidth && memoryInterface) {
      return `The memory is clocked at ${memoryClock} and has a bandwidth of ${memoryBandwidth} with a ${memoryInterface} interface. `;
    } else if (memoryClock && memoryBandwidth) {
      return `The memory is clocked at ${memoryClock} with a bandwidth of ${memoryBandwidth}. `;
    } else if (memoryClock && memoryInterface) {
      return `The memory is clocked at ${memoryClock} with a ${memoryInterface} interface. `;
    } else if (memoryBandwidth && memoryInterface) {
      return `The memory has a bandwidth of ${memoryBandwidth} with a ${memoryInterface} interface. `;
    } else if (memoryBandwidth) {
      return `The memory has a bandwidth of ${memoryBandwidth}. `;
    } else if (memoryInterface) {
      return `The memory has a ${memoryInterface} interface. `;
    } else {
      return '';
    }
  }, [specs]);

  return (
    <p>
      {sentence1}
      {sentence2}
    </p>
  );
};

const CompatibilityParagraph = () => {
  const { specs } = useContext(ProductContext);

  const sentence1 = useMemo(() => {
    const slots = formatSpec(specs.slotWidth);
    const length = formatSpec(specs.length, { suffix: false });
    const width = formatSpec(specs.width, { suffix: false });
    const height = formatSpec(specs.height, { suffix: false });

    if (slots && length && width && height) {
      return `This ${slots}-slot graphics card has dimensions of ${length} x ${width} x ${height} mm. `;
    } else if (slots) {
      return `This graphics card takes up ${slots} slots. `;
    } else if (length && width && height) {
      return `This graphics card has dimensions of ${length} x ${width} x ${height} mm. `;
    } else {
      return '';
    }
  }, [specs]);

  const sentence2 = useMemo(() => {
    const tdp = formatSpec(specs.thermalDesignPower);
    const suggestedPsu = formatSpec(specs.suggestedPsu);

    if (tdp && suggestedPsu) {
      return `It has a Thermal Design Power (TDP) of ${tdp} and it is recommended to be used with a minimum ${suggestedPsu} PSU. `;
    } else if (tdp) {
      return `It has a Thermal Design Power (TDP) of ${tdp}. `;
    } else if (suggestedPsu) {
      return `It is recommended to be used with a minimum ${suggestedPsu} PSU. `;
    } else {
      return '';
    }
  }, [specs]);

  return (
    <p>
      {sentence1}
      {sentence2}
    </p>
  );
};

const CoresParagraph = () => {
  const { specs } = useContext(ProductContext);

  const sentence1 = useMemo(() => {
    const clockSpeed = formatSpec(specs.coreClockSpeedBase);

    if (clockSpeed) {
      return `The card operates at a base clock speed of ${clockSpeed}. `;
    } else {
      return '';
    }
  }, [specs]);

  const sentence2 = useMemo(() => {
    const cores = formatSpec(specs.shaderUnitsCudaCores);
    const fp32 = formatSpec(specs.fp32Performance);
    const fp64 = formatSpec(specs.fp64Performance);

    const company = formatSpec(specs.company);
    let coresName = company === 'NVIDIA' ? 'CUDA Cores' : 'Cores';
    coresName = company === 'AMD' ? 'Shader Units' : 'Cores';

    if (cores && fp32 && fp64) {
      return `The ${cores} ${coresName} gives it a FP32 performance of ${fp32} and FP64 performance of ${fp64}. `;
    } else if (cores && fp32) {
      return `The ${cores} ${coresName} gives it a FP32 performance of ${fp32}. `;
    } else if (cores && fp64) {
      return `The ${cores} ${coresName} gives it a FP64 performance of ${fp64}. `;
    } else if (cores) {
      return `It has a total of ${cores} ${coresName}.`;
    } else if (fp32 && fp64) {
      return `It has a FP32 performance of ${fp32} and FP64 performance of ${fp64}. `;
    } else if (fp32) {
      return `It has a FP32 performance of ${fp32}. `;
    } else if (fp64) {
      return `It has a FP64 performance of ${fp64}. `;
    } else {
      return '';
    }
  }, [specs]);

  const sentence3 = useMemo(() => {
    const rops = formatSpec(specs.renderOutputUnits);
    const pixelFillRate = formatSpec(specs.pixelFillRate);

    if (rops && pixelFillRate) {
      return `The ${rops} Render Output Units (ROPs) gives it a pixel fill rate of ${pixelFillRate}. `;
    } else if (rops) {
      return `It has ${rops} Render Output Units (ROPs). `;
    } else if (pixelFillRate) {
      return `It has a pixel fill rate of ${pixelFillRate}. `;
    } else {
      return '';
    }
  }, [specs]);

  const sentence4 = useMemo(() => {
    const tmus = formatSpec(specs.textureMappingUnits);
    const textureFillRate = formatSpec(specs.textureFillRate);

    if (tmus && textureFillRate) {
      return `The ${tmus} Texture Mapping Units (TMUs) gives it a texture fill rate of ${textureFillRate}. `;
    } else if (tmus) {
      return `It has ${tmus} Texture Mapping Units (TMUs). `;
    } else if (textureFillRate) {
      return `It has a texture fill rate of ${textureFillRate}. `;
    } else {
      return '';
    }
  }, [specs]);

  return (
    <p>
      {sentence1}
      {sentence2}
      {sentence3}
      {sentence4}
    </p>
  );
};

const ConclusionParagraph = () => {
  const { product, specs, metas } = useContext(ProductContext);

  const sentence1 = useMemo(() => {
    const name = product.name;
    const company = formatSpec(specs.company);

    const performanceRank = formatProductMeta(metas.performanceRank, {
      ordinalSuffix: true,
    });
    const valueRank = formatProductMeta(metas.valueRank, {
      ordinalSuffix: true,
    });

    const performanceText = performanceRank === '1st' ? '' : performanceRank;
    const valueText = valueRank === '1st' ? '' : valueRank;

    if (performanceRank && valueRank) {
      return `The ${company} ${name} is the ${performanceText} most performant card and has the ${valueText} best value compared to other GPUs in our database. `;
    } else if (performanceRank) {
      return `The ${company} ${name} is the ${performanceText} most performant card compared to other GPUs in our database. `;
    } else if (valueRank) {
      return `The ${company} ${name} has the ${valueText} best value compared to other GPUs in our database. `;
    } else {
      return '';
    }
  }, [product, specs, metas]);

  const sentence2 = useMemo(() => {
    const name = product.name;
    const company = formatSpec(specs.company);

    const retailModels = metas.retailModels?.value;

    if (retailModels == null || retailModels.length == 0) {
      return <></>;
    }

    return (
      <>
        <a
          href={retailModels[0].amazonUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          Click here
        </a>{' '}
        to check the current availability and price of the {company} {name}.
      </>
    );
  }, [product, specs, metas]);

  return (
    <p>
      {sentence1}
      {sentence2}
    </p>
  );
};
