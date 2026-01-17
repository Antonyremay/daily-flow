import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
