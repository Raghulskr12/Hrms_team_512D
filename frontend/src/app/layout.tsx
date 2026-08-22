import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata: Metadata = {
  title: 'NexusHR — Workforce Intelligence Platform',
  description: 'Your workforce, connected. Modern HR management for high-performing teams.',
  keywords: 'HR, Human Resources, HRMS, Workforce Management, Attendance, Payroll',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0A0E1A] text-[#E8EDFF] min-h-screen antialiased transition-colors duration-300 dark">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
