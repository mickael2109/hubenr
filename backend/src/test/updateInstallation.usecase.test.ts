
const mockInstallationRepositoryUpdate = {
  getById: jest.fn(id => Promise.resolve({ id, status: 'PREPARATION' })),
  save: jest.fn(installation => Promise.resolve(installation)),
};

class UpdateInstallationStatusUseCase {
  constructor(private repo: any) {}

  async execute(id: string, newStatus: string) {
    const installation = await this.repo.getById(id);
    if (!installation) throw new Error('Installation not found');
    
    // Logique métier (simplement mise à jour ici)
    installation.status = newStatus;
    
    return this.repo.save(installation);
  }
}

describe('UpdateInstallationStatusUseCase', () => {
  it('should update the status and save the installation', async () => {
    // ARRANGE
    const useCase = new UpdateInstallationStatusUseCase(mockInstallationRepositoryUpdate);
    const installationId = 'inst-to-update';

    // ACT
    const result = await useCase.execute(installationId, 'INPROGRESS');

    // ASSERT
    expect(mockInstallationRepositoryUpdate.save).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('INPROGRESS');
  });
});