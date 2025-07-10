'use client';

import { useState } from 'react';

export default function ResendAdminUI() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const data = await response.json();

    if (data.error) {
      setStatus(`Error: ${data.error.message}`);
    } else {
      setStatus('Email sent successfully!');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-lime-400 mb-4">Send Email with Resend</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-300">To</label>
          <input
            type="email"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm text-white p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm text-white p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="html" className="block text-sm font-medium text-gray-300">HTML Content</label>
          <textarea
            id="html"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={10}
            className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm text-white p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors"
        >
          Send Email
        </button>
      </form>
      {status && <p className="mt-4 text-sm text-gray-300">{status}</p>}
    </div>
  );
}
