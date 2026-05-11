import { SHORT_OVAL_SIZES } from "./sizeData";
import type { NailSize } from "@/types";

// 幅を主(重み2)、長さを副(重み1)として加重距離最小のサイズを返す
export function matchSize(
  estimatedWidth: number,
  estimatedLength: number
): NailSize & { score: number } {
  let bestMatch = SHORT_OVAL_SIZES[0];
  let bestScore = Infinity;

  for (const size of SHORT_OVAL_SIZES) {
    // |width差|*2 + |length差|*1
    const score = Math.abs(size.width - estimatedWidth) * 2 + Math.abs(size.length - estimatedLength) * 1;
    if (score < bestScore) {
      bestScore = score;
      bestMatch = size;
    }
  }

  return { ...bestMatch, score: bestScore };
}
