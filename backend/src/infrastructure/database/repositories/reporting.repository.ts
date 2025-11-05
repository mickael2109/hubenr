// src/infrastructure/database/repositories/reporting.repository.ts
import prisma from '../prisma/client';
import { ReportingRepository, ConversionRateStats, AverageSignatureTimeStats } from '../../../domain/repositories/reporting.repository.interface';
import { QuoteStatus } from '../../../domain/entities/quote.entity';


export class PrismaReportingRepository implements ReportingRepository {
  async getConversionRate(): Promise<ConversionRateStats> {
    const sentOrSignedQuotes = await prisma.quote.count({
      where: {
        status: { in: [QuoteStatus.SENT, QuoteStatus.SIGNED, QuoteStatus.REFUSED, QuoteStatus.EXPIRED] }
      },
    });

    const signedQuotes = await prisma.quote.count({
      where: { status: QuoteStatus.SIGNED },
    });

    const conversionRate = sentOrSignedQuotes > 0 ? (signedQuotes / sentOrSignedQuotes) * 100 : 0;

    return {
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      sentQuotes: sentOrSignedQuotes,
      signedQuotes: signedQuotes,
    };
  }

  async getAverageSignatureTime(): Promise<AverageSignatureTimeStats> {
    // Prisma's aggregate feature can't do date differences directly.
    // A raw query is best for this.
    const result: any[] = await prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM "signedAt" - "sentAt")) AS avg_seconds
      FROM "Quote"
      WHERE status = 'SIGNED' AND "signedAt" IS NOT NULL AND "sentAt" IS NOT NULL
    `;

    if (result.length > 0 && result[0].avg_seconds !== null) {
      const averageSeconds = parseFloat(result[0].avg_seconds);
      const averageDays = averageSeconds / (60 * 60 * 24);
      return { averageDays: parseFloat(averageDays.toFixed(2)) };
    }

    return { averageDays: null };
  }
}