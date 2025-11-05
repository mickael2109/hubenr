class Quote {
  constructor(public id: string, public items: { unitPrice: number, quantity: number }[]) {}

  calculateTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }
}

describe('Quote Entity', () => {
  it('should correctly calculate the total amount from its items', () => {
    // ARRANGE (Initialisation)
    const quoteData = {
      id: 'q-123',
      items: [
        { unitPrice: 100, quantity: 2 }, // 200
        { unitPrice: 50, quantity: 5 },  // 250
        { unitPrice: 0, quantity: 1 }    // 0
      ]
    };
    const quote = new Quote(quoteData.id, quoteData.items);

    // ACT (Action)
    const total = quote.calculateTotalAmount();

    // ASSERT (Vérification)
    expect(total).toBe(450); // 200 + 250 = 450
  });
});