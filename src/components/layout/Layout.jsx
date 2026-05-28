import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

/**
 * Main Layout Component
 * Wraps authenticated pages with navbar and bottom navigation
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation - Hidden on mobile */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-6">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation - Mobile only */}
      <BottomNav />
    </div>
  );
}
