import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header', () => {
  it('renders the site name', () => {
    render(<Header />);
    const siteName = screen.getByText(/Electo/i);
    expect(siteName).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Guides/i)).toBeInTheDocument();
  });
});
