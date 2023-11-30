type AiPromptVariables = Record<string, string>;

const aiPromptTemplate = (variables: AiPromptVariables) => `
Write an overview for a GPU. The overview will be on a web page containing specs and benchmarks.
Do not include lists. Do not include tables. Do not include images.
It should be informative, objective, and unbiased.

The GPU is named NVIDIA GeForce RTX 4070. It was created by NVIDIA.

Each paragraph description includes data that should be included.
Replace the data point values with the variables provided.

The intro should mention about:
* Market segment: "desktop"
* Release date: "Q2 2023"
* Launch price: "$599"
* Codename: "AD104"
* Architecture: "Ada Lovelace"
* Process size: "5 nm"

The performance section should mention about:
* Performance rank in our database: "4"
* Performance rating: "69.79"
* Performance rating is our estimate of how it performance compares to the best performing GPU.
* Value rating: "67.33"
* Value rating is based on the performance per dollar compared to other GPUs in the database.

The memory section should mention about:
* Memory size: "12 GB"
* Memory type: "GDDR6X"
* Memory clock: "1,313 MHz"
* Memory interface: "192 bit"
* Memory bandwidth: "504.2 GB/s"

The cores and clock speed section should mention about:
* Cores: "5,888"
* Compute units: "46"
* TMUs: "184"
* ROPs: "64"
* Tensor Cores: "184"
* RT Cores: "46"
* Clock Speed: "1,920 MHz"
* Boost Speed: "2,475 MHz"

The power supply section should mention about:
* Suggested PSU: "200 W"
* Explain importance of having a large enough power supply.
`;

export function getGpuAiPrompt(variables: AiPromptVariables) {
  return aiPromptTemplate(variables);
}
