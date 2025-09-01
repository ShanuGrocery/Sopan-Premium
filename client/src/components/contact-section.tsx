import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, NotebookPen, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const inquirySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: InquiryFormData) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. We will get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InquiryFormData) => {
    inquiryMutation.mutate(data);
  };

  const subjects = [
    "General Inquiry",
    "Test Booking",
    "Report Issue",
    "Home Collection",
    "Corporate Package",
    "Feedback",
  ];

  const contactInfo = [
    {
      icon: <MapPin className="text-primary" />,
      title: "Laboratory Address",
      content: "123 Medical Complex, Health Street, Mumbai - 400001",
      bgColor: "bg-primary/10",
    },
    {
      icon: <Phone className="text-accent" />,
      title: "Phone Number",
      content: "+91 9876-543-210",
      bgColor: "bg-accent/10",
    },
    {
      icon: <Mail className="text-destructive" />,
      title: "Email Address",
      content: "info@medilabpro.com",
      bgColor: "bg-destructive/10",
    },
    {
      icon: <Clock className="text-primary" />,
      title: "Working Hours",
      content: "Mon-Sat: 8:00 AM - 8:00 PM\nSun: 9:00 AM - 5:00 PM",
      bgColor: "bg-primary/10",
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, color: "text-blue-500", hoverColor: "hover:bg-blue-500/20", bgColor: "bg-blue-500/10" },
    { icon: <Instagram />, color: "text-pink-500", hoverColor: "hover:bg-pink-500/20", bgColor: "bg-pink-500/10" },
    { icon: <Linkedin />, color: "text-blue-600", hoverColor: "hover:bg-blue-600/20", bgColor: "bg-blue-600/10" },
    { icon: <MessageCircle />, color: "text-green-500", hoverColor: "hover:bg-green-500/20", bgColor: "bg-green-500/10" },
  ];

  return (
    <section id="contact" className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-foreground mb-4">Contact Us</h3>
          <p className="text-xl text-muted-foreground">Get in touch with our healthcare experts</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-background p-6 rounded-xl border border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-6">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center`}>
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-medium">{info.title}</p>
                        <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="bg-background p-6 rounded-xl border border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`w-12 h-12 ${social.bgColor} rounded-lg flex items-center justify-center ${social.color} ${social.hoverColor} transition-colors`}
                      data-testid={`link-social-${index}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-background p-8 rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-6">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your full name" 
                              {...field} 
                              data-testid="input-contact-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+91 9876543210" 
                              {...field} 
                              data-testid="input-contact-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            {...field} 
                            data-testid="input-contact-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-contact-subject">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us how we can help you..." 
                            rows={4} 
                            {...field} 
                            data-testid="textarea-contact-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                    disabled={inquiryMutation.isPending}
                    data-testid="button-send-message"
                  >
                    <NotebookPen className="h-5 w-5" />
                    <span>{inquiryMutation.isPending ? "Sending..." : "Send Message"}</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Google Maps Integration Placeholder */}
        <div className="mt-12">
          <Card className="bg-background p-6 rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-4">Find Us on Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-4xl text-muted-foreground mb-4 mx-auto" />
                  <p className="text-muted-foreground">Google Maps integration can be implemented here</p>
                  <p className="text-sm text-muted-foreground mt-2">Interactive map showing laboratory location and directions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
