import {
  CompiledContentComponentVariant,
  CompiledContentFunctionVariant,
  ContentTag,
  ContentTags,
} from '../types';

export function hasRequiredTags(
  content: CompiledContentComponentVariant | CompiledContentFunctionVariant,
  tags?: ContentTags,
) {
  if (content.tags == null || content.tags.length === 0) {
    return true;
  }

  if (tags == null) {
    return false;
  }

  let tagsToCheck: Set<ContentTag>;
  if (Array.isArray(tags)) {
    tagsToCheck = new Set(tags || []);
  } else {
    const filtered: string[] = [];
    const keys = Object.keys(tags);
    for (const filter of keys) {
      if (tags[filter] === true) {
        filtered.push(filter);
      }
    }
    tagsToCheck = new Set(filtered);
  }

  return content.tags.every((hint) => tagsToCheck.has(hint));
}
