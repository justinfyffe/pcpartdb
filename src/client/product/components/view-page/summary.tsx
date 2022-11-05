import React, { useContext } from 'react';
import { ProductContext } from './product-context';

export const Summary = () => {
  const context = useContext(ProductContext);

  const { product } = context;

  return (
    <>
      <p>
        The RTX 3090 Ti by NVIDIA launched during Q3 2022 with a MSRP of $500.
        This desktop card is targeted towards the high-end market. It is the
        34th most performant and 5th best value among the GPUs in our database.
      </p>

      <p>
        The Ampere architecture GPU has 1 GB of GDDRX memory. The memory clocked
        at 2100 MHz and has a bandwidth of 1,000 GB/s with a 384-bit interface.
      </p>

      <p>
        The graphics card takes up 3 slots with dimensions of 336 x 140 x 61 mm.
        It has a TDP of 400 Watts and it is recommended to be used with a
        minimum 850 Watt PSU.
      </p>

      <p>
        The card operates at a base clock speed of 1,000 MHz. The 700 CUDA Cores
        gives it a FP32 performance of 26 TFLOPS and FP64 performance of 27
        GFLOPS. The 234 ROPs gives it a pixel fill rate of 24 GPixel/s. The 123
        TMUs gives it a texture fill rate of 25 GTexel/s.
      </p>

      <p>
        The NVIDIA RTX 3090 Ti has had a mostly positive reception. Check the
        current availability and price.
      </p>
    </>
  );
};
