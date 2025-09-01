import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <FlaskConical className="text-primary text-2xl" />
            <div>
              <h1 className="text-xl font-bold text-primary">MediLab Pro</h1>
              <p className="text-xs text-muted-foreground">Advanced Diagnostics</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-services"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('booking')} 
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-booking"
            >
              Book Test
            </button>
            <button 
              onClick={() => scrollToSection('reports')} 
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-reports"
            >
              Reports
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </button>
            <Link href="/admin">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-admin">
                Admin
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-menu-toggle"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-left text-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-left text-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-services"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('booking')} 
                className="text-left text-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-booking"
              >
                Book Test
              </button>
              <button 
                onClick={() => scrollToSection('reports')} 
                className="text-left text-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-reports"
              >
                Reports
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-left text-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-contact"
              >
                Contact
              </button>
              <Link href="/admin">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-mobile-admin">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
