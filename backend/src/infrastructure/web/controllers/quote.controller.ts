
import { Request, Response } from 'express';
import { QuoteStatus } from '../../../domain/entities/quote.entity';

// Import all Quote and QuoteItem Use Cases
import { CreateQuoteUseCase } from '../../../app/use-cases/quote/create-quote.use-case';
import { GetAllQuotesUseCase } from '../../../app/use-cases/quote/get-all-quotes.use-case';
import { GetQuoteByIdUseCase } from '../../../app/use-cases/quote/get-quote-by-id.use-case';
import { UpdateQuoteUseCase } from '../../../app/use-cases/quote/update-quote.use-case';
import { DeleteQuoteUseCase } from '../../../app/use-cases/quote/delete-quote.use-case';
import { MarkQuoteAsSentUseCase } from '../../../app/use-cases/quote/mark-quote-as-sent.use-case';
import { MarkQuoteAsSignedUseCase } from '../../../app/use-cases/quote/mark-quote-as-signed.use-case';
import { MarkQuoteAsRefusedUseCase } from '../../../app/use-cases/quote/mark-quote-as-refused.use-case';
import { AddQuoteItemUseCase } from '../../../app/use-cases/quote/add-quote-item.use-case';
import { UpdateQuoteItemUseCase } from '../../../app/use-cases/quote/update-quote-item.use-case';
import { RemoveQuoteItemUseCase } from '../../../app/use-cases/quote/remove-quote-item.use-case';

// Import DTOs
import { CreateQuoteRequest, UpdateQuoteRequest, AddQuoteItemRequest, UpdateQuoteItemRequest, MarkQuoteAsSentRequest, MarkQuoteAsSignedRequest } from '../../../app/interfaces/quote';
import { ApplicationError } from '../../../shared/erros/app.error';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';

export class QuoteController {
  constructor(
    // Quote Use Cases
    private createQuoteUseCase: CreateQuoteUseCase,
    private getAllQuotesUseCase: GetAllQuotesUseCase,
    private getQuoteByIdUseCase: GetQuoteByIdUseCase,
    private updateQuoteUseCase: UpdateQuoteUseCase,
    private deleteQuoteUseCase: DeleteQuoteUseCase,
    // Status Change Use Cases
    private markQuoteAsSentUseCase: MarkQuoteAsSentUseCase,
    private markQuoteAsSignedUseCase: MarkQuoteAsSignedUseCase,
    private markQuoteAsRefusedUseCase: MarkQuoteAsRefusedUseCase,
    // Quote Item Use Cases
    private addQuoteItemUseCase: AddQuoteItemUseCase,
    private updateQuoteItemUseCase: UpdateQuoteItemUseCase,
    private removeQuoteItemUseCase: RemoveQuoteItemUseCase,
  ) {}

  // --- Quote CRUD ---

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const createRequest = req.body as CreateQuoteRequest;
      if (!createRequest.leadId || !Array.isArray(createRequest.items)) {
        return res.status(400).json({ message: 'leadId and items array are required.', success: false });
      }
      const quote = await this.createQuoteUseCase.execute(createRequest);
      return res.status(201).json({
        success: true,
        data: quote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create quote.',);
    }
  }

  async findAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, leadId } = req.query;
      const quotes = await this.getAllQuotesUseCase.execute(status as QuoteStatus, leadId as string);
      return res.status(200).json({
        success: true,
        data: quotes,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve quotes.');
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const quote = await this.getQuoteByIdUseCase.execute(id);
      return res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve quote.');
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateQuoteRequest;
      const updatedQuote = await this.updateQuoteUseCase.execute(id, updateData);
      return res.status(200).json({
        success: true,
        data: updatedQuote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update quote.');
    }
  }
  
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteQuoteUseCase.execute(id);
      return res.status(204).send();
    } catch (error: any) {
      this.handleError(error, res, 'Failed to delete quote.');
    }
  }

  // --- Quote Status Changes ---

  async markAsSent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { expiresAt } = req.body as MarkQuoteAsSentRequest;
      if (!expiresAt) {
        return res.status(400).json({ message: 'expiresAt is required.', success: false });
      }
      const quote = await this.markQuoteAsSentUseCase.execute(id, { expiresAt: new Date(expiresAt) });
      return res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to mark quote as sent.');
    }
  }

  async markAsSigned(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // In a real scenario, the proof might be generated by the server
      const signedProof = {
        signedAt: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      };
      const quote = await this.markQuoteAsSignedUseCase.execute(id, { signedProof });
      return res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to mark quote as signed.');
    }
  }

  async markAsRefused(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const quote = await this.markQuoteAsRefusedUseCase.execute(id);
      return res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to mark quote as refused.');
    }
  }

  // --- Quote Item Management ---

  async addItem(req: Request, res: Response) {
    try {
      const { quoteId } = req.params;
      const itemRequest = req.body as AddQuoteItemRequest;
      const updatedQuote = await this.addQuoteItemUseCase.execute(quoteId, itemRequest);
      return res.status(200).json({
        success: true,
        data: updatedQuote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to add item to quote.');
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const { quoteId, itemId } = req.params;
      const itemUpdateRequest = req.body as UpdateQuoteItemRequest;
      const updatedQuote = await this.updateQuoteItemUseCase.execute(quoteId, itemId, itemUpdateRequest);
      return res.status(200).json({
        success: true,
        data: updatedQuote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update item in quote.');
    }
  }

  async removeItem(req: Request, res: Response) {
    try {
      const { quoteId, itemId } = req.params;
      const updatedQuote = await this.removeQuoteItemUseCase.execute(quoteId, itemId);
      return res.status(200).json({
        success: true,
        data: updatedQuote,
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to remove item from quote.');
    }
  }

  // --- Private Error Handler ---

  private handleError(error: any, res: Response, defaultMessage: string) {
    console.error(`Error in QuoteController:`, error);
    if (error instanceof ApplicationError) {
      return res.status(error.statusCode).json({ message: error.message, success: false });
    }
    return res.status(500).json({ message: defaultMessage, success: false });
  }
}