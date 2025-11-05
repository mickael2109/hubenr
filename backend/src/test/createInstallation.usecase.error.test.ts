

const mockInstallationRepositoryError = {
  save: jest.fn(), 
};
const mockQuoteRepositoryError = {
  getById: jest.fn(id => Promise.resolve({ 
    id, 
    status: 'SENT' 
  })),
};
describe('CreateInstallationUseCase - Validation', () => {
  it('should throw an error and NOT save if the quote is not signed', async () => {
    // ARRANGE
    const useCase = new CreateInstallationUseCase(mockInstallationRepositoryError, mockQuoteRepositoryError);
    const quoteId = 'sent-quote-id';

    // ACT & ASSERT
    await expect(useCase.execute(quoteId)).rejects.toThrow('Quote must be signed to create an installation.');
    
    expect(mockInstallationRepository.save).not.toHaveBeenCalled();
  });
});