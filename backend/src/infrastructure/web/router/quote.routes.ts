// src/infrastructure/web/router/quote.routes.ts
import { Router } from 'express';
import { QuoteController } from '../controllers/quote.controller';

// Repositories
import { PrismaQuoteRepository } from '../../database/repositories/quote.repository';
import { PrismaLeadRepository } from '../../database/repositories/lead.repository';

// Quote Use Cases
import { CreateQuoteUseCase } from '../../../app/use-cases/quote/create-quote.use-case';
import { GetAllQuotesUseCase } from '../../../app/use-cases/quote/get-all-quotes.use-case';
import { GetQuoteByIdUseCase } from '../../../app/use-cases/quote/get-quote-by-id.use-case';
import { UpdateQuoteUseCase } from '../../../app/use-cases/quote/update-quote.use-case';
import { DeleteQuoteUseCase } from '../../../app/use-cases/quote/delete-quote.use-case';
import { MarkQuoteAsSentUseCase } from '../../../app/use-cases/quote/mark-quote-as-sent.use-case';
import { MarkQuoteAsSignedUseCase } from '../../../app/use-cases/quote/mark-quote-as-signed.use-case';
import { MarkQuoteAsRefusedUseCase } from '../../../app/use-cases/quote/mark-quote-as-refused.use-case';

// Quote Item Use Cases
import { AddQuoteItemUseCase } from '../../../app/use-cases/quote/add-quote-item.use-case';
import { UpdateQuoteItemUseCase } from '../../../app/use-cases/quote/update-quote-item.use-case';
import { RemoveQuoteItemUseCase } from '../../../app/use-cases/quote/remove-quote-item.use-case';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';

const createQuotesRouter = (): Router => {
  const router = Router();

  // --- Dependency Injection ---
  const quoteRepository = new PrismaQuoteRepository();
  const leadRepository = new PrismaLeadRepository();

  const createQuoteUseCase = new CreateQuoteUseCase(quoteRepository, leadRepository);
  const getAllQuotesUseCase = new GetAllQuotesUseCase(quoteRepository);
  const getQuoteByIdUseCase = new GetQuoteByIdUseCase(quoteRepository);
  const updateQuoteUseCase = new UpdateQuoteUseCase(quoteRepository, leadRepository);
  const deleteQuoteUseCase = new DeleteQuoteUseCase(quoteRepository);
  const markQuoteAsSentUseCase = new MarkQuoteAsSentUseCase(quoteRepository);
  const markQuoteAsSignedUseCase = new MarkQuoteAsSignedUseCase(quoteRepository);
  const markQuoteAsRefusedUseCase = new MarkQuoteAsRefusedUseCase(quoteRepository);
  const addQuoteItemUseCase = new AddQuoteItemUseCase(quoteRepository);
  const updateQuoteItemUseCase = new UpdateQuoteItemUseCase(quoteRepository);
  const removeQuoteItemUseCase = new RemoveQuoteItemUseCase(quoteRepository);

  const quoteController = new QuoteController(
    createQuoteUseCase,
    getAllQuotesUseCase,
    getQuoteByIdUseCase,
    updateQuoteUseCase,
    deleteQuoteUseCase,
    markQuoteAsSentUseCase,
    markQuoteAsSignedUseCase,
    markQuoteAsRefusedUseCase,
    addQuoteItemUseCase,
    updateQuoteItemUseCase,
    removeQuoteItemUseCase,
  );

  // --- Quote Routes ---
  router.post('/',authMiddleware, (req, res) => quoteController.create(req as AuthenticatedRequest, res));
  router.get('/',authMiddleware, (req, res) => quoteController.findAll(req as AuthenticatedRequest, res));
  router.get('/:id', (req, res) => quoteController.findById(req, res));
  router.put('/:id',authMiddleware, (req, res) => quoteController.update(req as AuthenticatedRequest, res));
  router.delete('/:id', (req, res) => quoteController.delete(req, res));

  // --- Quote Status Change Routes ---
  router.post('/:id/send', (req, res) => quoteController.markAsSent(req, res));
  router.post('/:id/sign', (req, res) => quoteController.markAsSigned(req, res));
  router.post('/:id/refuse', (req, res) => quoteController.markAsRefused(req, res));

  // --- Quote Item Routes ---
  router.post('/:quoteId/items', (req, res) => quoteController.addItem(req, res));
  router.put('/:quoteId/items/:itemId', (req, res) => quoteController.updateItem(req, res));
  router.delete('/:quoteId/items/:itemId', (req, res) => quoteController.removeItem(req, res));

  return router;
};

export default createQuotesRouter;