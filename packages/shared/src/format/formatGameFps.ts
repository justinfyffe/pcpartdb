import { ProductGameFps } from '../product';

export interface FormatGameFpsOptions {
  fps?: boolean;
  fpsPerDollar?: boolean;
  cpf?: boolean;
  showUnits?: boolean;
  minDecimals?: number;
  maxDecimals?: number;
}

export function formatGameFps(
  productGameFps: ProductGameFps,
  options?: FormatGameFpsOptions,
) {
  if (productGameFps == null) {
    return null;
  }

  if (options?.fps) {
    return formatFpsImpl(productGameFps, options);
  }

  if (options?.cpf) {
    return formatCpfImpl(productGameFps, options);
  }

  if (options?.fpsPerDollar) {
    return formatFpsPerDollarImpl(productGameFps, options);
  }

  return formatFpsImpl(productGameFps, options);
}

function formatFpsImpl(
  productGameFps: ProductGameFps,
  options?: FormatGameFpsOptions,
) {
  const fps = productGameFps?.fps?.toLocaleString(undefined, {
    minimumFractionDigits: options?.minDecimals ?? 0,
    maximumFractionDigits: options?.maxDecimals ?? 0,
  });
  if (fps == null) {
    return null;
  }
  const showUnits = options?.showUnits !== false;
  return showUnits ? `${fps} FPS` : fps;
}

function formatFpsPerDollarImpl(
  productGameFps: ProductGameFps,
  options?: FormatGameFpsOptions,
) {
  const fps = productGameFps?.fpsPerDollar.toLocaleString(undefined, {
    minimumFractionDigits: options?.minDecimals ?? 0,
    maximumFractionDigits: options?.maxDecimals ?? 2,
  });
  if (fps == null) {
    return null;
  }
  return fps;
}

function formatCpfImpl(
  productGameFps: ProductGameFps,
  options?: FormatGameFpsOptions,
) {
  const cpf = productGameFps?.dollarsPerFrame?.toLocaleString(undefined, {
    minimumFractionDigits: options?.minDecimals ?? 0,
    maximumFractionDigits: options?.maxDecimals ?? 2,
  });
  if (cpf == null) {
    return null;
  }
  const showUnits = options?.showUnits !== false;
  return showUnits ? `$${cpf} CPF` : `$${cpf};`;
}
