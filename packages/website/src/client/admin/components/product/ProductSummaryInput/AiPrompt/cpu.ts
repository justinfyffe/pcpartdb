type AiPromptVariables = Record<string, string>;

const aiPromptTemplate = (variables: AiPromptVariables) => `
***** START INTRO CSV DATA *****
description,value
cpu name,NVIDIA GeForce RTX 4070
manufacturer,NVIDIA
market segment,desktop 
release date,Q2 2023
msrp,$599
codename,AD104
architecture,Ada Lovelace
process size,5 nm
***** END INTRO CSV DATA *****
***** START PERFORMANCE CSV DATA *****
description,value
performance rank,4
performance rating,69.79
value rating,67.33
best performing gpu name,NVIDIA GeForce RTX 4090
performance compared to best performaning gpu,69.79%
***** END PERFORMANCE CSV DATA *****
***** START MEMORY CSV DATA *****
description,value
memory size,12 GB
memory type,GDDR6X
memory clock,"1,313 MHz"
memory interface,192 bit
memory bandwidth,504.2 GB/s
***** END MEMORY CSV DATA *****
***** START CORES/CLOCK CSV DATA *****
description,value
cores,"5,888"
compute units,46
texture mapping units,184
rops,64
tensor cores,184
rt cores,46
core clock speed,"1,920 MHz"
boost clock speed,"2,475 MHz"
***** START COMPATIBILITY CSV DATA *****
description,value
suggested psu,200 W
slot width (pcie),3.5
dimensions,"200 mm (L) x 50 mm (H)"
***** END COMPATIBILITY CSV DATA *****
***** START PERFOMRANCE DETAILS TO INCLUDE *****
1. Performance rating is our estimate of how it performs compares to the best performing GPU in our database.
2, Value rating is based on the performance per dollar compared to other GPUs in the database.
***** END PERFOMRANCE DETAILS TO INCLUDE *****
***** START COMPATIBILITY DETAILS TO INCLUDE *****
1. Importance of having a large enough power supply.
2. Enough space to fit the GPU if it's a desktop or workstation market segment GPU.
***** END COMPATIBILITY DETAILS TO INCLUDE *****
***** START SUMMARY INSTRUCTIONS *****
1. Write an approximately 400 word summary about the CPU using the provided CSV data and details to include above.
2. Do not write bullet points or lists. Do not write headings. Only write paragraphs.
3. The summary target 4-5 paragraphs if possible.
4. There should be an intro, a performance paragraph, a memory paragraph, a cores/clock paragraph, a compability paragraph.
5. Each paragraph should be brief, only a few sentences based on the data above.
6. Include additional descriptors that apply. For example, "small", "large", "high-end", "low-end".
7. The summary should be unbiased and evergreen.
***** END SUMMARY INSTRUCTIONS *****
`;

export function getCpuAiPrompt(variables: AiPromptVariables) {
  return aiPromptTemplate(variables);
}
