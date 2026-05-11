export type EstimateRequest = {
  imageTop: string;  // base64 (no prefix)
};

export type EstimateResponse = {
  width_mm: number;
  length_mm: number;
  confidence: number;  // 0〜1
  notes: string;
};

export type EstimateError = {
  error: string;
  retryable: boolean;
};

export type NailSize = {
  size: number;
  length: number;
  width: number;
  innerCurve: number;
};
