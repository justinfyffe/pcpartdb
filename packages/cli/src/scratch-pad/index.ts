import { scratchPad } from './scratchPad';

export interface ScratchPadCommandArgs {}

export async function scratchPadCommand(_args: ScratchPadCommandArgs) {
  await scratchPad();
}
