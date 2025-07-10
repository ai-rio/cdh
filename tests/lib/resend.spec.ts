
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Declare mockSend outside the mock factory
let mockSend: ReturnType<typeof vi.fn>;

// Use vi.doMock to ensure the mock is set up before the module under test is imported
vi.doMock('resend', () => {
  mockSend = vi.fn(); // Initialize mockSend here
  return {
    Resend: vi.fn(() => ({
      emails: {
        send: mockSend,
      },
    })),
  };
});

// Dynamically import the module under test AFTER the mock is defined
const { sendEmail } = await import('@/lib/resend');

// Assign the mocked send function to a more descriptive variable
const mockResendSend = mockSend;

describe('sendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure the mock is reset for each test
    mockResendSend.mockResolvedValue({ data: {}, error: null });
  });

  it('should send an email successfully', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    };

    mockResendSend.mockResolvedValueOnce({ data: { id: 'email_id_123' }, error: null });

    const result = await sendEmail(emailData);

    expect(mockResendSend).toHaveBeenCalledTimes(1);
    expect(mockResendSend).toHaveBeenCalledWith({
      from: 'onboarding@resend.dev',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });
    expect(result).toEqual({ data: { id: 'email_id_123' } });
  });

  it('should return an error if Resend API returns an error', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    };
    const resendError = { name: 'ResendError', message: 'Failed to send' };

    mockResendSend.mockResolvedValueOnce({ data: null, error: resendError });

    // Mock console.error to prevent actual logging during test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await sendEmail(emailData);

    expect(mockResendSend).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ error: resendError });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', resendError);

    consoleErrorSpy.mockRestore();
  });

  it('should return an error if there is a network or unexpected error', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    };
    const networkError = new Error('Network down');

    mockResendSend.mockRejectedValueOnce(networkError);

    // Mock console.error to prevent actual logging during test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await sendEmail(emailData);

    expect(mockResendSend).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ error: networkError });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', networkError);

    consoleErrorSpy.mockRestore();
  });
});
