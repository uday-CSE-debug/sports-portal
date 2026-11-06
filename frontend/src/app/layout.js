import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TransitionProvider from '@/components/TransitionProvider';

export const metadata = {
  title: 'Vignan Sports Portal',
  description: 'Vignan College Sports Equipment Booking Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-[#FDFDFF] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <TransitionProvider>
              <main>{children}</main>
            </TransitionProvider>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
