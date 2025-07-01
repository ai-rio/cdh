import '@testing-library/jest-dom/vitest';
import React from 'react';

vi.stubGlobal('requestAnimationFrame', vi.fn());
vi.stubGlobal('cancelAnimationFrame', vi.fn());