import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { quoteState } from "./type";
import type { QuoteInterface, QuoteItemInterface } from "../../types/QuoteInterface";
import { createQuote, createQuoteItem, deleteQuoteItem, getAllQuotes, refusedQuote, sendQuote, signedQuote, updateQuoteItem } from "./thunk";


const initialState: quoteState = {
    status: "idle",
    error: null,
    quotes: [],
    quoteSelected: null,
    quoteItemSelected: null,
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: { 
    selectQuote: (state, action: PayloadAction<QuoteInterface>) => {
      state.quoteSelected = action.payload;
    },
    selectQuoteItem: (state, action: PayloadAction<QuoteItemInterface>) => {
      state.quoteItemSelected = action.payload;
    },
  },
   

  extraReducers: (builder) => {


    /**
     * get all quote
     */
    builder.addCase(getAllQuotes.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.quotes = data
      }
      state.error = null;
      state.status = "succeeded";
    });

    builder.addCase(getAllQuotes.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAllQuotes.rejected, (state, action) => {    
      state.status = "failed";
      state.error = action.error.message || "An error occurred";
    });



    /**
     * create quote
     */
    builder.addCase(createQuote.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.quotes.push(data);
      }
      state.status = "succeeded";
      state.error = null;
    });

    builder.addCase(createQuote.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(createQuote.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });



    /**
     * create quote item
     */
    builder.addCase(createQuoteItem.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if (success && data?.id) {
        const idx = state.quotes.findIndex((p) => p.id === data.id);
        if (idx !== -1) {
          state.quotes[idx] = data
        }
        if (state.quoteSelected?.id === data.id) {
          state.quoteSelected= data
        }
      }
    });

    builder.addCase(createQuoteItem.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(createQuoteItem.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });



    /**
     * update quote item
     */
    builder.addCase(updateQuoteItem.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if (success && data?.id) {
        const idx = state.quotes.findIndex((p) => p.id === data.id);
        if (idx !== -1) {
          state.quotes[idx] = data
        }
        if (state.quoteSelected?.id === data.id) {
          state.quoteSelected= data
        }
      }
    });

    builder.addCase(updateQuoteItem.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(updateQuoteItem.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });


    /**
     * delete quote item
     */
    builder.addCase(deleteQuoteItem.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if (success && data?.id) {
        const idx = state.quotes.findIndex((p) => p.id === data.id);
        if (idx !== -1) {
          state.quotes[idx] = data
        }
        if (state.quoteSelected?.id === data.id) {
          state.quoteSelected= data
        }
      }
    });

    builder.addCase(deleteQuoteItem.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(deleteQuoteItem.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });


    /**
     * send quote
     */
    builder.addCase(sendQuote.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if (success && data?.id) {
        const idx = state.quotes.findIndex((p) => p.id === data.id);
        if (idx !== -1) {
          state.quotes[idx] = data
        }
        if (state.quoteSelected?.id === data.id) {
          state.quoteSelected= data
        }
      }
    });

    builder.addCase(sendQuote.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(sendQuote.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });




    /**
     * signed quote
     */
    builder.addCase(signedQuote.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if (success && data?.id) {
        const idx = state.quotes.findIndex((p) => p.id === data.id);
        if (idx !== -1) {
          state.quotes[idx] = data
        }
        if (state.quoteSelected?.id === data.id) {
          state.quoteSelected= data
        }
      }
    });

    builder.addCase(signedQuote.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(signedQuote.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });



    /**
     * refused quote
     */
    builder.addCase(refusedQuote.fulfilled, (state, action) => {
      const { data, success, status } = action.payload;
      console.log("action.payload : ",action.payload);
      
      
      if (success && data?.quoteId) {
        const idx = state.quotes.findIndex((p) => p.id === data.quoteId);
        if (idx !== -1) {
          const oldItem = state.quotes[idx];
          state.quotes[idx] = {
            ...oldItem, 
            status: status
          };
        }
      }
    });

    builder.addCase(refusedQuote.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(refusedQuote.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });

  },
});


export const { selectQuote, selectQuoteItem } = quoteSlice.actions
export default quoteSlice.reducer;


