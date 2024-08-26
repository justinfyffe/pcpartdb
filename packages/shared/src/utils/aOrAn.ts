interface AOrAnOptions {
  capitalize?: boolean;
}

export function aOrAn(word: string, options?: AOrAnOptions) {
  const first = word.charAt(0).toLowerCase();
  const isAn =
    first === 'a' ||
    first === 'e' ||
    first === 'i' ||
    first === 'o' ||
    first === 'u';

  if (isAn) {
    return options?.capitalize ? 'An' : 'an';
  } else {
    return options?.capitalize ? 'A' : 'a';
  }
}
