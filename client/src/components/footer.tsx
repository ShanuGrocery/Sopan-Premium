import { FlaskConical, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    "About Us",
    "Our Services", 
    "Health Packages",
    "Home Collection",
    "Download Reports",
  ];

  const services = [
    "Pathology Tests",
    "Radiology & Imaging",
    "Preventive Health",
    "Corporate Packages",
    "Doctor Consultation",
  ];

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <FlaskConical className="text-primary text-2xl" />
              <div>
                <h4 className="text-xl font-bold text-primary">MediLab Pro</h4>
                <p className="text-sm text-background/70">Advanced Diagnostics</p>
              </div>
            </div>
            <p className="text-background/70 mb-4">
              Leading diagnostic laboratory providing accurate, reliable, and timely medical testing services.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center text-background hover:bg-primary transition-colors"
                data-testid="footer-social-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center text-background hover:bg-primary transition-colors"
                data-testid="footer-social-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center text-background hover:bg-primary transition-colors"
                data-testid="footer-social-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2 text-background/70">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-primary transition-colors" data-testid={`footer-quick-link-${index}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-4">Services</h5>
            <ul className="space-y-2 text-background/70">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-primary transition-colors" data-testid={`footer-service-link-${index}`}>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-4">Contact Info</h5>
            <div className="space-y-3 text-background/70">
              <div className="flex items-center space-x-2">
                <span className="text-primary">📍</span>
                <span>123 Medical Complex, Health Street, Mumbai - 400001</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-primary">📞</span>
                <span>+91 9876-543-210</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-primary">✉️</span>
                <span>info@medilabpro.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
          <p>&copy; 2024 MediLab Pro. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
