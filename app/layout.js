import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import CustomCursor from '../components/CustomCursor';

export const metadata = {
  title: 'Triple-Mode Portfolio | Ramit Gupta',
  description: 'An immersive portfolio featuring XP, Dev, and Creative modes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased cursor-none">
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
