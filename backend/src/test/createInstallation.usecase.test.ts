const mockInstallationRepository = {
  save: jest.fn(installation => Promise.resolve(installation)),
};

const mockQuoteRepository = {
  getById: jest.fn(id => Promise.resolve({ 
    id, 
    status: 'SIGNED' 
  })),
};


class CreateInstallationUseCase {
  constructor(private installationRepo: any, private quoteRepo: any) {}

  async execute(quoteId: string) {
    const quote = await this.quoteRepo.getById(quoteId);
    if (quote.status !== 'SIGNED') {
      throw new Error('Quote must be signed to create an installation.');
    }
    const newInstallation = {
      id: 'new-inst-id',
      quoteId: quote.id,
      status: 'PREPARATION', 
    };
    return this.installationRepo.save(newInstallation);
  }
}


describe('CreateInstallationUseCase', () => {
  it('should create an installation with PREPARATION status if quote is signed', async () => {

    const useCase = new CreateInstallationUseCase(mockInstallationRepository, mockQuoteRepository);
    const quoteId = 'signed-quote-id';

    const result = await useCase.execute(quoteId);

    expect(mockInstallationRepository.save).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('PREPARATION');
    expect(result.quoteId).toBe(quoteId);
  });
});