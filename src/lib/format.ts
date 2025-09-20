export function formatWithSignificant(n: number, sig = 4): string {
  if (!isFinite(n)) return "0";
  if (n === 0) return "0";
  const digits = Math.floor(Math.log10(Math.abs(n))) + 1;
  const decimals = Math.max(0, sig - digits);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatEggBalance(input: string | number | bigint): string {
  let n: number;
  if (typeof input === "bigint") n = Number(input);
  else if (typeof input === "string") n = parseFloat(input);
  else n = input;

  if (!isFinite(n)) return "0";

  // Normal formatting up to 100 with ~4 significant figures
  if (Math.abs(n) < 1000) {
    if (Math.abs(n) < 100) {
      return formatWithSignificant(n, 4);
    }
    // For 100 to 999, show without decimals
    return Math.round(n).toLocaleString();
  }

  const units = ["k", "M", "B", "T", "P", "E"] as const;
  let value = n;
  let unitIndex = -1;
  while (Math.abs(value) >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  // Keep 3–4 significant digits overall in the compact form
  let display: string;
  const absVal = Math.abs(value);
  if (absVal >= 100) display = Math.round(value).toString();
  else if (absVal >= 10) display = (Math.round(value * 10) / 10).toString();
  else display = (Math.round(value * 100) / 100).toString();

  return `${display}${units[unitIndex]}`;
}

