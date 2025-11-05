import type { QuoteInterface, QuoteItemInterface } from "../../types/QuoteInterface";


export interface quoteState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    quotes: QuoteInterface[];
    quoteSelected: QuoteInterface | null;
    quoteItemSelected: QuoteItemInterface | null;
}

