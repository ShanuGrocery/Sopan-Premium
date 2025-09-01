import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertBookingSchema, insertInquirySchema, insertTestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tests
  app.get("/api/tests", async (req, res) => {
    try {
      const tests = await storage.getAllTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tests" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if patient exists, create if not
      let patient = await storage.getPatientByEmail(req.body.patientEmail);
      if (!patient) {
        const patientData = insertPatientSchema.parse({
          fullName: req.body.patientName,
          email: req.body.patientEmail,
          phone: req.body.patientPhone,
          dateOfBirth: req.body.patientDob || null,
          address: req.body.address || null,
        });
        patient = await storage.createPatient(patientData);
      }

      // Create booking with patient ID
      const booking = await storage.createBooking({
        ...bookingData,
        patientId: patient.id,
      });

      // Create initial report entry
      await storage.createReport({
        bookingId: booking.id,
        patientId: patient.id,
        status: "processing",
      });

      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });

  // Get patient reports
  app.post("/api/reports/search", async (req, res) => {
    try {
      const { patientId, phone, dateOfBirth } = req.body;
      
      let patient;
      if (patientId) {
        patient = await storage.getPatient(patientId);
      } else if (phone) {
        const patients = await storage.getAllPatients();
        patient = patients.find(p => p.phone === phone && p.dateOfBirth === dateOfBirth);
      }

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const reports = await storage.getReportsByPatient(patient.id);
      const bookings = await storage.getBookingsByPatient(patient.id);
      
      // Combine reports with booking and test information
      const reportsWithDetails = await Promise.all(
        reports.map(async (report) => {
          const booking = bookings.find(b => b.id === report.bookingId);
          const test = booking ? await storage.getTest(booking.testId) : null;
          return {
            ...report,
            booking,
            test,
          };
        })
      );

      res.json(reportsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Submit inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit inquiry" });
      }
    }
  });

  // Admin routes
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const patient = await storage.getPatient(booking.patientId);
          const test = await storage.getTest(booking.testId);
          return {
            ...booking,
            patient,
            test,
          };
        })
      );
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      const patientsWithStats = await Promise.all(
        patients.map(async (patient) => {
          const bookings = await storage.getBookingsByPatient(patient.id);
          return {
            ...patient,
            totalBookings: bookings.length,
            lastVisit: bookings.length > 0 ? Math.max(...bookings.map(b => new Date(b.bookingDate!).getTime())) : null,
          };
        })
      );
      res.json(patientsWithStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/admin/reports", async (req, res) => {
    try {
      const reports = await storage.getAllInquiries();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.patch("/api/admin/bookings/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const booking = await storage.updateBookingStatus(id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  app.post("/api/admin/tests", async (req, res) => {
    try {
      const testData = insertTestSchema.parse(req.body);
      const test = await storage.createTest(testData);
      res.json(test);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid test data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create test" });
      }
    }
  });

  app.patch("/api/admin/tests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const testData = req.body;
      
      const test = await storage.updateTest(id, testData);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Failed to update test" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
