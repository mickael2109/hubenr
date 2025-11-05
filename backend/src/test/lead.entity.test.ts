
enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  RELANCE = 'RELANCE',
  RDV = 'RDV',
  SENT = 'SENT',
}

class Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  assignedToUserId?: string;
  status: LeadStatus; 

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    status: LeadStatus = LeadStatus.NEW, 
    company?: string,
    assignedToUserId?: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.company = company;
    this.assignedToUserId = assignedToUserId;
  }

  updateStatus(newStatus: LeadStatus): void {
    if (this.status === LeadStatus.SENT && newStatus !== LeadStatus.RDV) {
    }
    this.status = newStatus;
  }
}

describe('Lead Entity', () => {
  it('should initialize a new lead with status "NEW" by default', () => {
    // ARRANGE
    const leadData = {
      id: 'l-456',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '0123456789',
    };

    // ACT
    const lead = new Lead(
      leadData.id,
      leadData.firstName,
      leadData.lastName,
      leadData.email,
      leadData.phone
    );

    // ASSERT
    expect(lead.status).toBe(LeadStatus.NEW);
    expect(lead.firstName).toBe('Jean'); 
  });

  it('should allow updating the lead status', () => {
    // ARRANGE
    const lead = new Lead(
      'l-789',
      'Alice',
      'Smith',
      'alice@example.com',
      '0987654321'
    );
    expect(lead.status).toBe(LeadStatus.NEW); 

    // ACT
    lead.updateStatus(LeadStatus.CONTACTED);

    // ASSERT
    expect(lead.status).toBe(LeadStatus.CONTACTED);
  });
});