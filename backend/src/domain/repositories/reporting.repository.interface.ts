
export interface ConversionRateStats {
    conversionRate: number;
    sentQuotes: number;
    signedQuotes: number;
}

export interface AverageSignatureTimeStats {
    averageDays: number | null;
}

export interface ReportingRepository {
  getConversionRate(): Promise<ConversionRateStats>;
  getAverageSignatureTime(): Promise<AverageSignatureTimeStats>;
}