import { render, screen } from '@testing-library/react';
import ProfileSection from '../ProfileSection';

const mockUserProfile = {
  fullName: 'Test User',
  joinDate: '2023-01-01',
};

test('renders profile data from prop', () => {
  render(<ProfileSection userProfile={mockUserProfile} />);
  expect(screen.getByText(/Full Name:/)).toBeInTheDocument();
  expect(screen.getByText(/Test User/)).toBeInTheDocument();
  expect(screen.getByText(/Joined:/)).toBeInTheDocument();
  expect(screen.getByText(/2023-01-01/)).toBeInTheDocument();
});
