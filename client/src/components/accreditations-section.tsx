import { Tag, Award, Shield, Star } from "lucide-react";

export default function AccreditationsSection() {
  const accreditations = [
    {
      icon: <Tag className="text-3xl text-accent" />,
      title: "NABL Certified",
      description: "National Accreditation Board for Testing",
    },
    {
      icon: <Award className="text-3xl text-primary" />,
      title: "ISO 15189",
      description: "Medical Laboratory Quality Standards",
    },
    {
      icon: <Shield className="text-3xl text-destructive" />,
      title: "CAP Accredited",
      description: "College of American Pathologists",
    },
    {
      icon: <Star className="text-3xl text-accent" />,
      title: "5-Star Rating",
      description: "Customer Satisfaction Score",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Accreditations & Certifications</h3>
          <p className="text-xl text-muted-foreground">Trusted by healthcare professionals and patients nationwide</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 items-center">
          {accreditations.map((accreditation, index) => (
            <div key={index} className="text-center group">
              <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-4 border border-border group-hover:shadow-lg transition-all">
                {accreditation.icon}
              </div>
              <h4 className="font-semibold mb-2">{accreditation.title}</h4>
              <p className="text-sm text-muted-foreground">{accreditation.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
