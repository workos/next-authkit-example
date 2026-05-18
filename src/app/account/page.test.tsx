import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AccountPage from './page';

// Mock the withAuth function from @workos-inc/authkit-nextjs
jest.mock('@workos-inc/authkit-nextjs', () => ({
  withAuth: jest.fn(),
}));

const mockWithAuth = jest.requireMock('@workos-inc/authkit-nextjs').withAuth;

describe('AccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the account page with heading and subheading', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText('Below are your account details')).toBeInTheDocument();
  });

  it('displays user first name', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  it('displays user last name', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  it('displays user email', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
  });

  it('displays user id', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByDisplayValue('user-123')).toBeInTheDocument();
  });

  it('displays role when provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: 'admin',
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
  });

  it('displays permissions when provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: ['read', 'write'],
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByDisplayValue('read,write')).toBeInTheDocument();
  });

  it('displays both role and permissions when both are provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: 'admin',
      permissions: ['read', 'write', 'delete'],
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('read,write,delete')).toBeInTheDocument();
  });

  it('renders correct number of fields when role is provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: 'admin',
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    // Should have 5 fields: First name, Last name, Email, Role, Id
    const textFields = screen.getAllByRole('textbox');
    expect(textFields).toHaveLength(5);
  });

  it('renders correct number of fields when permissions are provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: ['read'],
    });

    const Page = await AccountPage();
    render(Page);

    // Should have 5 fields: First name, Last name, Email, Permissions, Id
    const textFields = screen.getAllByRole('textbox');
    expect(textFields).toHaveLength(5);
  });

  it('renders correct number of fields when both role and permissions are provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: 'admin',
      permissions: ['read'],
    });

    const Page = await AccountPage();
    render(Page);

    // Should have 6 fields: First name, Last name, Email, Role, Permissions, Id
    const textFields = screen.getAllByRole('textbox');
    expect(textFields).toHaveLength(6);
  });

  it('renders correct number of fields when neither role nor permissions are provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    // Should have 4 fields: First name, Last name, Email, Id
    const textFields = screen.getAllByRole('textbox');
    expect(textFields).toHaveLength(4);
  });

  it('renders labels for each field', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByText('Last name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Id')).toBeInTheDocument();
  });

  it('renders label for role field when role is provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: 'admin',
      permissions: undefined,
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders label for permissions field when permissions are provided', async () => {
    mockWithAuth.mockResolvedValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: 'user-123',
      },
      role: undefined,
      permissions: ['read'],
    });

    const Page = await AccountPage();
    render(Page);

    expect(screen.getByText('Permissions')).toBeInTheDocument();
  });
});
