import { render, screen } from '@testing-library/react';
import App from './App';
jest.mock('./hooks/useAuthProfile', () => ({
  useAuthProfile: () => ({
    userProfile: {
      fullName: 'Test User',
      joinedAt: '2023-01-01T00:00:00.000Z',
    },
    loading: false,
    error: null,
  }),
}));

test('renders AI Calendar heading(s)', () => {
  render(<App />);
  const headings = screen.getAllByRole('heading', { name: /AI Calendar/i });
  expect(headings.length).toBeGreaterThan(0);
});
