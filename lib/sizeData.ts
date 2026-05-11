import type { NailSize } from "@/types";

// ショートオーバルサイズ表
// length: 外側カーブ長さ（根本から先端までの曲線に沿った長さ）[mm]
// width: 直線幅（爪の横幅）[mm]
// innerCurve: PoCでは未使用 [mm]
export const SHORT_OVAL_SIZES: NailSize[] = [
  { size: 0, length: 20, width: 13, innerCurve: 16.5 },
  { size: 1, length: 19, width: 12, innerCurve: 15 },
  { size: 2, length: 18, width: 11, innerCurve: 13.5 },
  { size: 3, length: 17, width: 10, innerCurve: 12 },
  { size: 4, length: 16, width: 9, innerCurve: 11.5 },
  { size: 5, length: 15, width: 8.5, innerCurve: 11 },
  { size: 6, length: 14.5, width: 8, innerCurve: 10.5 },
  { size: 7, length: 14, width: 7.5, innerCurve: 9 },
  { size: 8, length: 14, width: 7, innerCurve: 8 },
  { size: 9, length: 13, width: 6, innerCurve: 7.5 },
];
