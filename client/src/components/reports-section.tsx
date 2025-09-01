import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Search, Download, Lock, Bell, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const reportSearchSchema = z.object({
  patientId: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

type ReportSearchData = z.infer<typeof reportSearchSchema>;

export default function ReportsSection() {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const form = useForm<ReportSearchData>({
    resolver: zodResolver(reportSearchSchema),
    defaultValues: {
      patientId: "",
      phone: "",
      dateOfBirth: "",
    },
  });

  const reportSearchMutation = useMutation({
    mutationFn: async (data: ReportSearchData) => {
      const response = await apiRequest("POST", "/api/reports/search", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data);
      if (data.length === 0) {
        toast({
          title: "No Reports Found",
          description: "No reports found for the provided information. Please check your details and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reports Found",
          description: `Found ${data.length} report(s) for your account.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search for reports. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    },
  });

  const onSubmit = (data: ReportSearchData) => {
    reportSearchMutation.mutate(data);
  };

  return (
    <section id="reports" className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-foreground mb-4">Download Your Reports</h3>
          <p className="text-xl text-muted-foreground">Secure access to your diagnostic reports anytime, anywhere</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Report Access Form */}
          <Card className="bg-background p-8 rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-6">Access Your Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient ID / Reference Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your patient ID" 
                            {...field} 
                            data-testid="input-patient-id"
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
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+91 9876543210" 
                            {...field} 
                            data-testid="input-phone-search"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-dob-search"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                    disabled={reportSearchMutation.isPending}
                    data-testid="button-find-reports"
                  >
                    <Search className="h-5 w-5" />
                    <span>{reportSearchMutation.isPending ? "Searching..." : "Find My Reports"}</span>
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">Reports will be sent via SMS & Email when ready</p>
                  </div>
                </form>
              </Form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h4 className="font-semibold text-lg">Your Reports</h4>
                  {searchResults.map((report, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{report.test?.name || "Test Report"}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: <span className={`capitalize ${report.status === 'ready' ? 'text-accent' : 'text-primary'}`}>
                              {report.status}
                            </span>
                          </p>
                          {report.booking && (
                            <p className="text-sm text-muted-foreground">
                              Date: {new Date(report.booking.preferredDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div>
                          {report.status === 'ready' ? (
                            <Button size="sm" data-testid={`button-download-report-${index}`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">Processing...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports Features */}
          <div className="space-y-6">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Healthcare professional reviewing digital reports" 
              className="rounded-xl shadow-lg w-full" 
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-card p-6 rounded-lg border border-border">
                <Download className="text-primary text-2xl mb-3" />
                <h5 className="font-semibold mb-2">Instant Download</h5>
                <p className="text-sm text-muted-foreground">Download reports instantly in PDF format</p>
              </Card>
              <Card className="bg-card p-6 rounded-lg border border-border">
                <Lock className="text-accent text-2xl mb-3" />
                <h5 className="font-semibold mb-2">Secure Access</h5>
                <p className="text-sm text-muted-foreground">OTP-based secure report access</p>
              </Card>
              <Card className="bg-card p-6 rounded-lg border border-border">
                <Bell className="text-destructive text-2xl mb-3" />
                <h5 className="font-semibold mb-2">Notifications</h5>
                <p className="text-sm text-muted-foreground">SMS & Email alerts when ready</p>
              </Card>
              <Card className="bg-card p-6 rounded-lg border border-border">
                <Video className="text-primary text-2xl mb-3" />
                <h5 className="font-semibold mb-2">Consultation</h5>
                <p className="text-sm text-muted-foreground">Video consultation with doctors</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
