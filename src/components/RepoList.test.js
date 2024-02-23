import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RepoList from './RepoList';

test('renders repos for a user', async () => {
  render(<RepoList username="cdjacome2" />);
  const listItem = await screen.findByText(/repos/i);
  expect(listItem).toBeInTheDocument();
});



