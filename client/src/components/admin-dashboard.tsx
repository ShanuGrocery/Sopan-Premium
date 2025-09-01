import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Home, Clock, DollarSign, Edit, FileText, Users, TestTube, Eye, Search, Upload, Plus, Send, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch admin data
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
  });

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ["/api/admin/patients"],
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/admin/reports"],
  });

  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ["/api/tests"],
  });

  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/bookings/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    },
  });

  // Calculate stats
  const todayBookings = bookings?.filter((booking: any) => {
    const today = new Date().toDateString();
    const bookingDate = new Date(booking.preferredDate).toDateString();
    return bookingDate === today;
  }).length || 0;

  const homeCollections = bookings?.filter((booking: any) => 
    booking.collectionMethod === "home"
  ).length || 0;

  const pendingReports = bookings?.filter((booking: any) => 
    booking.status === "pending"
  ).length || 0;

  const todayRevenue = bookings?.filter((booking: any) => {
    const today = new Date().toDateString();
    const bookingDate = new Date(booking.preferredDate).toDateString();
    return bookingDate === today;
  }).reduce((sum: number, booking: any) => sum + (booking.totalAmount || 0), 0) || 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "destructive" as const, label: "Pending" },
      confirmed: { variant: "default" as const, label: "Confirmed" },
      completed: { variant: "secondary" as const, label: "Completed" },
      cancelled: { variant: "outline" as const, label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCollectionBadge = (method: string) => {
    return method === "home" ? (
      <Badge className="bg-accent/10 text-accent">Home</Badge>
    ) : (
      <Badge variant="outline">Lab Visit</Badge>
    );
  };

  if (bookingsLoading || patientsLoading || testsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{todayBookings}</p>
                <p className="text-sm text-muted-foreground">Today's Bookings</p>
              </div>
              <CalendarDays className="text-primary text-xl" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-accent">{homeCollections}</p>
                <p className="text-sm text-muted-foreground">Home Collections</p>
              </div>
              <Home className="text-accent text-xl" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-destructive">{pendingReports}</p>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
              </div>
              <Clock className="text-destructive text-xl" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">₹{(todayRevenue / 100).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
              </div>
              <DollarSign className="text-primary text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings" className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4" />
            <span>Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center space-x-2">
            <TestTube className="h-4 w-4" />
            <span>Tests</span>
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Patients</span>
          </TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Patient</th>
                      <th className="text-left p-3 text-sm font-medium">Test</th>
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-left p-3 text-sm font-medium">Collection</th>
                      <th className="text-left p-3 text-sm font-medium">Status</th>
                      <th className="text-left p-3 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings?.slice(0, 10).map((booking: any) => (
                      <tr key={booking.id} className="border-b border-border">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{booking.patient?.fullName}</p>
                            <p className="text-sm text-muted-foreground">{booking.patient?.phone}</p>
                          </div>
                        </td>
                        <td className="p-3">{booking.test?.name}</td>
                        <td className="p-3">{new Date(booking.preferredDate).toLocaleDateString()}, {booking.preferredTime}</td>
                        <td className="p-3">{getCollectionBadge(booking.collectionMethod)}</td>
                        <td className="p-3">{getStatusBadge(booking.status)}</td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateBookingMutation.mutate({ 
                              id: booking.id, 
                              status: booking.status === "pending" ? "confirmed" : "completed" 
                            })}
                            disabled={updateBookingMutation.isPending}
                            data-testid={`button-update-booking-${booking.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Report Management</CardTitle>
              <Button className="flex items-center space-x-2" data-testid="button-upload-report">
                <Upload className="h-4 w-4" />
                <span>Upload Report</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inquiries?.slice(0, 5).map((inquiry: any) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="text-destructive text-xl" />
                      <div>
                        <p className="font-medium">{inquiry.fullName}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : "Recent"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-accent/10 text-accent">New</Badge>
                      <Button size="sm" variant="ghost" data-testid={`button-send-report-${inquiry.id}`}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Test Management</CardTitle>
              <Button className="flex items-center space-x-2" data-testid="button-add-test">
                <Plus className="h-4 w-4" />
                <span>Add New Test</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests?.map((test: any) => (
                  <div key={test.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium">{test.name}</h5>
                      <Button size="sm" variant="ghost" data-testid={`button-edit-test-${test.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                    <p className="font-semibold text-primary">₹{(test.price / 100).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Report time: {test.reportTime}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Patient Database</CardTitle>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  data-testid="input-search-patients"
                />
                <Button data-testid="button-search-patients">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients
                  ?.filter((patient: any) =>
                    searchTerm === "" ||
                    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.phone.includes(searchTerm)
                  )
                  .slice(0, 10)
                  .map((patient: any) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{patient.fullName}</p>
                          <p className="text-sm text-muted-foreground">{patient.email} | {patient.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            Total bookings: {patient.totalBookings || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-accent/10 text-accent">
                          {patient.totalBookings || 0} Tests
                        </Badge>
                        <Button size="sm" variant="ghost" data-testid={`button-view-patient-${patient.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
