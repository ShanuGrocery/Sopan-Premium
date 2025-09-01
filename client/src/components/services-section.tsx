import { Microscope, Zap, Heart, Check } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: <Microscope className="text-primary text-2xl" />,
      title: "Pathology Tests",
      description: "Complete blood work, biochemistry, hematology, and specialized pathology investigations.",
      features: [
        "Complete Blood Count (CBC)",
        "Lipid Profile",
        "Liver Function Tests",
        "Kidney Function Tests"
      ],
      bgColor: "bg-primary/10",
      hoverColor: "group-hover:bg-primary/20"
    },
    {
      icon: <Zap className="text-accent text-2xl" />,
      title: "Radiology & Imaging",
      description: "Advanced imaging services including digital X-rays, ultrasound, and CT scans.",
      features: [
        "Digital X-Ray",
        "Ultrasound Scanning",
        "CT Scan",
        "MRI Scanning"
      ],
      bgColor: "bg-accent/10",
      hoverColor: "group-hover:bg-accent/20"
    },
    {
      icon: <Heart className="text-destructive text-2xl" />,
      title: "Health Packages",
      description: "Comprehensive health checkup packages for preventive healthcare and early detection.",
      features: [
        "Full Body Checkup",
        "Diabetes Screening",
        "Cardiac Health Package",
        "Women's Health Package"
      ],
      bgColor: "bg-destructive/10",
      hoverColor: "group-hover:bg-destructive/20"
    }
  ];

  return (
    <section id="services" className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">Our Services</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive diagnostic solutions with cutting-edge technology and expert medical professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-background p-8 rounded-xl border border-border hover:shadow-lg transition-all group"
            >
              <div className={`w-16 h-16 ${service.bgColor} rounded-xl flex items-center justify-center mb-6 ${service.hoverColor} transition-colors`}>
                {service.icon}
              </div>
              <h4 className="text-xl font-semibold mb-4">{service.title}</h4>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2">
                    <Check className="text-accent text-xs h-4 w-4" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
