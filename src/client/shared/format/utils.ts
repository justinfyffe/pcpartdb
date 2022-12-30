export function getOrdinalNumber(value: number | string) {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return null;
  }

  let suffix = '';
  const ones = num % 10;
  const tens = num % 100;
  if (ones == 1 && tens != 11) {
    suffix = 'st';
  } else if (ones == 2 && tens != 12) {
    suffix = 'nd';
  } else if (ones == 3 && tens != 13) {
    suffix = 'rd';
  } else {
    suffix = 'th';
  }

  return `${num}${suffix}`;
}
