import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, Home, MapPin, Clock, Shield, Video, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Test } from "@shared/schema";

const bookingSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientEmail: z.string().email("Invalid email address"),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  testId: z.string().min(1, "Please select a test"),
  preferredDate: z.string().min(1, "Please select a date"),
  preferredTime: z.string().min(1, "Please select a time"),
  collectionMethod: z.enum(["home", "lab"]),
  address: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      testId: "",
      preferredDate: "",
      preferredTime: "",
      collectionMethod: "home",
      address: "",
    },
  });

  const { data: tests, isLoading: testsLoading } = useQuery<Test[]>({
    queryKey: ["/api/tests"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const selectedTest = tests?.find(test => test.id === data.testId);
      const bookingData = {
        patientId: "", // Will be handled by the backend
        testId: data.testId,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        collectionMethod: data.collectionMethod,
        address: data.collectionMethod === "home" ? data.address : undefined,
        totalAmount: selectedTest?.price || 0,
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
      };
      
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful!",
        description: "Your test has been booked successfully. You will receive a confirmation SMS and email shortly.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book your test. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  const popularTests = tests?.slice(0, 3) || [];

  return (
    <section id="booking" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-foreground mb-4">Book Your Test Online</h3>
          <p className="text-xl text-muted-foreground">Simple, fast, and secure online test booking with home collection option</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <Card className="bg-card p-8 rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-6">Book Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Patient Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field} 
                              data-testid="input-patient-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="patientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+91 9876543210" 
                              {...field} 
                              data-testid="input-patient-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="patientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            {...field} 
                            data-testid="input-patient-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Test Selection */}
                  <FormField
                    control={form.control}
                    name="testId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Test/Package</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-test">
                              <SelectValue placeholder="Choose a test or package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {testsLoading ? (
                              <SelectItem value="loading" disabled>Loading tests...</SelectItem>
                            ) : (
                              tests?.map((test) => (
                                <SelectItem key={test.id} value={test.id}>
                                  {test.name} - ₹{(test.price / 100).toLocaleString()}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              min={new Date().toISOString().split('T')[0]}
                              data-testid="input-preferred-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-time">
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Collection Method */}
                  <FormField
                    control={form.control}
                    name="collectionMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Collection Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid md:grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2 p-4 border border-input rounded-lg">
                              <RadioGroupItem value="home" id="home" data-testid="radio-home-collection" />
                              <Label htmlFor="home" className="flex-1 cursor-pointer">
                                <div>
                                  <p className="font-medium">Home Collection</p>
                                  <p className="text-sm text-muted-foreground">Free for orders above ₹500</p>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border border-input rounded-lg">
                              <RadioGroupItem value="lab" id="lab" data-testid="radio-lab-visit" />
                              <Label htmlFor="lab" className="flex-1 cursor-pointer">
                                <div>
                                  <p className="font-medium">Visit Lab</p>
                                  <p className="text-sm text-muted-foreground">Walk-in or appointment</p>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address (for home collection) */}
                  {form.watch("collectionMethod") === "home" && (
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address (for home collection)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your complete address" 
                              {...field} 
                              data-testid="textarea-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                    disabled={bookingMutation.isPending}
                    data-testid="button-book-appointment"
                  >
                    <CalendarCheck className="h-5 w-5" />
                    <span>{bookingMutation.isPending ? "Booking..." : "Book Appointment"}</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Booking Info & Popular Tests */}
          <div className="space-y-8">
            {/* Popular Tests */}
            <Card className="bg-card p-6 rounded-xl border border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">Popular Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularTests.map((test) => (
                    <div key={test.id} className="flex justify-between items-center p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">{test.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">₹{(test.price / 100).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{test.reportTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="bg-card p-6 rounded-xl border border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">Why Choose MediLab Pro?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="text-accent h-5 w-5" />
                    <span>NABL & ISO certified laboratory</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="text-accent h-5 w-5" />
                    <span>Fast & accurate reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Home className="text-accent h-5 w-5" />
                    <span>Free home sample collection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Smartphone className="text-accent h-5 w-5" />
                    <span>Digital reports on mobile</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Video className="text-accent h-5 w-5" />
                    <span>Doctor consultation available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
