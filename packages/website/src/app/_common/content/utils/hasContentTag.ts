import { ContentTag, ContentTags } from '../types';

export function hasContentTags(
  haystack: ContentTags,
  ...needles: ContentTag[]
) {
  if (haystack == null) {
    return false;
  }

  if (needles?.length == null || needles.length === 0) {
    return true;
  }

  let tagsToCheck: Set<ContentTag>;
  if (Array.isArray(haystack)) {
    tagsToCheck = new Set(haystack || []);
  } else {
    const filtered: string[] = [];
    const keys = Object.keys(haystack);
    for (const filter of keys) {
      if (haystack[filter] === true) {
        filtered.push(filter);
      }
    }
    tagsToCheck = new Set(filtered);
  }

  return needles.every((hint) => tagsToCheck.has(hint));
}
