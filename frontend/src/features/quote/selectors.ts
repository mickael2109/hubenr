import type { RootState } from "../../app/store";



export const getQuotes = (state: RootState) => state.quote.quotes;
export const getQuoteSelected = (state: RootState) => state.quote.quoteSelected;
export const getQuoteItemSelected = (state: RootState) => state.quote.quoteItemSelected;