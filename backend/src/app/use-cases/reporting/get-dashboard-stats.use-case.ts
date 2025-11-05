import { ReportingRepository } from '../../../domain/repositories/reporting.repository.interface';

export class GetDashboardStatsUseCase {
  constructor(private reportingRepository: ReportingRepository) {}

  async execute() {
    const [conversionRateStats, averageTimeStats] = await Promise.all([
      this.reportingRepository.getConversionRate(),
      this.reportingRepository.getAverageSignatureTime(),
    ]);

    return {
      conversionRate: conversionRateStats.conversionRate,
      averageSignatureTimeInDays: averageTimeStats.averageDays,
      totalSentOrFinishedQuotes: conversionRateStats.sentQuotes,
      totalSignedQuotes: conversionRateStats.signedQuotes,
    };
  }
}