import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blue Harbor | Task Manager',
  description: 'Task management assignment',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
