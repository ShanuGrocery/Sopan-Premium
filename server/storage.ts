import { 
  type User, 
  type InsertUser, 
  type Patient, 
  type InsertPatient,
  type Test,
  type InsertTest,
  type Booking,
  type InsertBooking,
  type Report,
  type InsertReport,
  type Inquiry,
  type InsertInquiry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Patients
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByEmail(email: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getAllPatients(): Promise<Patient[]>;

  // Tests
  getTest(id: string): Promise<Test | undefined>;
  getAllTests(): Promise<Test[]>;
  createTest(test: InsertTest): Promise<Test>;
  updateTest(id: string, test: Partial<InsertTest>): Promise<Test | undefined>;

  // Bookings
  getBooking(id: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByPatient(patientId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;

  // Reports
  getReport(id: string): Promise<Report | undefined>;
  getReportsByPatient(patientId: string): Promise<Report[]>;
  getReportByBooking(bookingId: string): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: string, report: Partial<InsertReport>): Promise<Report | undefined>;

  // Inquiries
  getInquiry(id: string): Promise<Inquiry | undefined>;
  getAllInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private patients: Map<string, Patient> = new Map();
  private tests: Map<string, Test> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private reports: Map<string, Report> = new Map();
  private inquiries: Map<string, Inquiry> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some test data
    const tests: Test[] = [
      {
        id: "1",
        name: "Complete Blood Count (CBC)",
        description: "Basic blood analysis including hemoglobin, white blood cells, red blood cells, and platelets",
        price: 45000, // ₹450
        reportTime: "24 hours",
        category: "pathology"
      },
      {
        id: "2",
        name: "Lipid Profile",
        description: "Cholesterol screening including total cholesterol, HDL, LDL, and triglycerides",
        price: 65000, // ₹650
        reportTime: "24 hours",
        category: "pathology"
      },
      {
        id: "3",
        name: "Liver Function Test",
        description: "Assessment of liver health including ALT, AST, bilirubin, and alkaline phosphatase",
        price: 75000, // ₹750
        reportTime: "24 hours",
        category: "pathology"
      },
      {
        id: "4",
        name: "Full Body Checkup",
        description: "Comprehensive health package including blood work, urine analysis, and basic imaging",
        price: 249900, // ₹2,499
        reportTime: "48 hours",
        category: "package"
      },
      {
        id: "5",
        name: "Diabetes Package",
        description: "Complete diabetes screening including HbA1c, fasting glucose, and insulin levels",
        price: 89900, // ₹899
        reportTime: "24 hours",
        category: "package"
      },
      {
        id: "6",
        name: "Thyroid Profile",
        description: "Thyroid function assessment including TSH, T3, and T4",
        price: 55000, // ₹550
        reportTime: "24 hours",
        category: "pathology"
      }
    ];

    tests.forEach(test => this.tests.set(test.id, test));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Patients
  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByEmail(email: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(patient => patient.email === email);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { ...insertPatient, id };
    this.patients.set(id, patient);
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  // Tests
  async getTest(id: string): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async getAllTests(): Promise<Test[]> {
    return Array.from(this.tests.values());
  }

  async createTest(insertTest: InsertTest): Promise<Test> {
    const id = randomUUID();
    const test: Test = { ...insertTest, id };
    this.tests.set(id, test);
    return test;
  }

  async updateTest(id: string, testUpdate: Partial<InsertTest>): Promise<Test | undefined> {
    const test = this.tests.get(id);
    if (!test) return undefined;
    
    const updatedTest = { ...test, ...testUpdate };
    this.tests.set(id, updatedTest);
    return updatedTest;
  }

  // Bookings
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByPatient(patientId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.patientId === patientId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      bookingDate: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Reports
  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReportsByPatient(patientId: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.patientId === patientId);
  }

  async getReportByBooking(bookingId: string): Promise<Report | undefined> {
    return Array.from(this.reports.values()).find(report => report.bookingId === bookingId);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = { 
      ...insertReport, 
      id, 
      uploadedAt: new Date()
    };
    this.reports.set(id, report);
    return report;
  }

  async updateReport(id: string, reportUpdate: Partial<InsertReport>): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...reportUpdate };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  // Inquiries
  async getInquiry(id: string): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = randomUUID();
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry = { ...inquiry, status };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
}

export const storage = new MemStorage();
