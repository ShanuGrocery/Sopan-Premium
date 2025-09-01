import { CalendarPlus, Home, Tag, Shield, UserRound, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Advanced Diagnostic
              <span className="text-primary"> Healthcare</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              State-of-the-art laboratory services with AI-powered diagnostics, 
              home sample collection, and instant digital reports. Your health, our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                onClick={() => scrollToSection('booking')}
                data-testid="button-book-test"
              >
                <CalendarPlus className="h-5 w-5" />
                <span>Book Test Online</span>
              </Button>
              <Button 
                variant="outline"
                className="border border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-muted transition-colors flex items-center justify-center space-x-2"
                onClick={() => scrollToSection('booking')}
                data-testid="button-home-collection"
              >
                <Home className="h-5 w-5" />
                <span>Home Collection</span>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 mt-8 pt-8 border-t border-border">
              <div className="flex items-center space-x-2">
                <Tag className="text-accent h-5 w-5" />
                <span className="text-sm font-medium">NABL Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-accent h-5 w-5" />
                <span className="text-sm font-medium">ISO 15189</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserRound className="text-accent h-5 w-5" />
                <span className="text-sm font-medium">Expert Staff</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern medical laboratory" 
              className="rounded-2xl shadow-2xl w-full" 
            />
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Clock className="text-accent h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">24-Hour Reports</p>
                  <p className="text-sm text-muted-foreground">Fast & Accurate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
