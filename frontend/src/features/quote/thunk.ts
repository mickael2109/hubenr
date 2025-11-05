/* eslint-disable no-useless-catch */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { quoteService } from '../../service/quote.service';
import type { QuoteDataInterface, QuoteItemDataInterface, QuoteStatus, sendQuoteDataInterface } from '../../types/QuoteInterface';




/**
 * get all quote
 */
export const getAllQuotes = createAsyncThunk(
  'quote/getAllQuotes',
  async (access_token: string) => {
    try {
      const response = await quoteService.getAllQuotes(access_token); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);


/**
 * create quote
 */
export const createQuote = createAsyncThunk(
  'quote/createQuote',
  async (quoteData : QuoteDataInterface) => {
    try {
      const response = await quoteService.createQuote(quoteData); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);





/**
 * add quote item
 */
export const createQuoteItem = createAsyncThunk(
  'quote/createQuoteItem',
  async (quoteItemData : QuoteItemDataInterface) => {
    try {
      const response = await quoteService.createQuoteItem(quoteItemData); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);



/**
 * update quote item
 */
export const updateQuoteItem = createAsyncThunk(
  'quote/updateQuoteItem',
  async (quoteItemData : QuoteItemDataInterface) => {
    try {
      const response = await quoteService.updateQuoteItem(quoteItemData); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);


/**
 * delete quote item
 */
export const deleteQuoteItem = createAsyncThunk(
  'quote/deleteQuoteItem',
  async (quoteItemData : QuoteItemDataInterface) => {
    try {
      const response = await quoteService.deleteQuoteItem(quoteItemData); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);



/**
 * send quote
 */
export const sendQuote = createAsyncThunk(
  'quote/sendQuote',
  async (data : sendQuoteDataInterface) => {
    try {
      const response = await quoteService.sendQuote(data); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);





/**
 * signer quote
 */
export const signedQuote = createAsyncThunk(
  'quote/signedQuote',
  async (quoteId : string) => {
    try {
      const response = await quoteService.signedQuote(quoteId); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);




/**
 * refused quote
 */
export const refusedQuote = createAsyncThunk(
  'quote/refusedQuote',
  async (
    {quoteId, status} : {quoteId : string, status : QuoteStatus}
  ) => {
    try {
      const response = await quoteService.refusedQuote(quoteId, status); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);