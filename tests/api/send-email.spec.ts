
import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '@/pages/api/send-email';
import * as ResendModule from '@/lib/resend';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock the sendEmail function
vi.mock('@/lib/resend', () => ({
  sendEmail: vi.fn(),
}));

const mockSendEmail = vi.mocked(ResendModule.sendEmail);

describe('/api/send-email', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let statusSpy: ReturnType<typeof vi.spyOn>;
  let jsonSpy: ReturnType<typeof vi.spyOn>;
  let endSpy: ReturnType<typeof vi.spyOn>;
  let setHeaderSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn(() => res as NextApiResponse),
      json: vi.fn(),
      end: vi.fn(),
      setHeader: vi.fn(),
    };
    statusSpy = vi.spyOn(res, 'status');
    jsonSpy = vi.spyOn(res, 'json');
    endSpy = vi.spyOn(res, 'end');
    setHeaderSpy = vi.spyOn(res, 'setHeader');
    mockSendEmail.mockClear();
  });

  it('should return 200 and data on successful email send', async () => {
    req.method = 'POST';
    req.body = {
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    };
    mockSendEmail.mockResolvedValueOnce({ data: { id: 'email_id_123' }, error: null });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });
    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith({ data: { id: 'email_id_123' } });
  });

  it('should return 500 and error if sendEmail fails', async () => {
    req.method = 'POST';
    req.body = {
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    };
    const resendError = { name: 'ResendError', message: 'Failed to send' };
    mockSendEmail.mockResolvedValueOnce({ data: null, error: resendError });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ error: resendError });
  });

  it('should return 400 if required fields are missing', async () => {
    req.method = 'POST';
    req.body = {
      to: 'test@example.com',
      subject: 'Test Subject',
      // html is missing
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  it('should return 405 for unsupported methods', async () => {
    req.method = 'GET';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(setHeaderSpy).toHaveBeenCalledWith('Allow', ['POST']);
    expect(statusSpy).toHaveBeenCalledWith(405);
    expect(endSpy).toHaveBeenCalledWith('Method GET Not Allowed');
  });
});
