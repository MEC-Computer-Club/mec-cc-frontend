export type BorrowedItemStatus = "In Use" | "Returned" | "Overdue" | "Damaged" | "Maintenance";

export type ClubAssetStatus = "Available" | "In Use" | "Maintenance" | "Retired";

export type AssetCondition = "New" | "Excellent" | "Good" | "Fair" | "Damaged";

export interface BorrowedEquipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  borrowedFrom: string; // e.g. "CSE Dept Lab", "Central Store", "Dept Office"
  borrowedBy: string;   // e.g. "Nasir (President)"
  borrowDate: string;   // YYYY-MM-DD
  dueDate: string;      // YYYY-MM-DD or text like "Permanent Borrow"
  returnDate?: string;  // YYYY-MM-DD when returned
  status: BorrowedItemStatus;
  location: string;     // e.g. "Club Room 302"
  condition: AssetCondition;
  notes?: string;
  updatedAt?: string;
}

export interface ClubAsset {
  id: string;
  name: string;
  category: string;
  quantity: number;
  acquisitionDate: string; // YYYY-MM-DD
  custodian: string;       // Person or Wing currently responsible
  location: string;        // Where it is physically stored
  status: ClubAssetStatus;
  condition: AssetCondition;
  estimatedValue?: string; // e.g. "৳ 850"
  notes?: string;
  updatedAt?: string;
}

export const INITIAL_BORROWED_EQUIPMENT: BorrowedEquipment[] = [
  {
    id: "dept-eq-1",
    name: "TP-Link Archer Dual-Band Gigabit Router",
    category: "Networking",
    quantity: 1,
    borrowedFrom: "Monir Vai (Lab Attendant)",
    borrowedBy: "Abdullah Al Shafi (Hardware & Systems Coordinator)",
    borrowDate: "2024-01-15",
    dueDate: "2024-12-31",
    status: "In Use",
    location: "Club Room 302",
    condition: "Good",
    notes: "High-speed router for club room coding sessions & mock contest network.",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "dept-eq-2",
    name: "Heavy Duty 6-Socket Multiplugs",
    category: "Electrical",
    quantity: 3,
    borrowedFrom: "Monir Vai (Lab Attendant)",
    borrowedBy: "Abdullah Zubayer Talukder (Resource & Logistics Manager)",
    borrowDate: "2024-02-10",
    dueDate: "2024-12-31",
    status: "In Use",
    location: "Club Room 302",
    condition: "Good",
    notes: "Essential power distribution strips for multi-laptop CP practice sessions.",
    updatedAt: "2024-02-10T14:30:00Z",
  },
  {
    id: "dept-eq-3",
    name: "Large Wooden Computer Tables",
    category: "Furniture",
    quantity: 2,
    borrowedFrom: "Dulal Sir (Dept Head)",
    borrowedBy: "Faisal Ahmed (President)",
    borrowDate: "2024-01-12",
    dueDate: "Permanent Borrow",
    status: "In Use",
    location: "Club Room 302",
    condition: "Fair",
    notes: "Dedicated workstations for club executive desk & server hub.",
    updatedAt: "2024-01-12T11:00:00Z",
  },
  {
    id: "dept-eq-4",
    name: "Armed Student Chairs",
    category: "Furniture",
    quantity: 30,
    borrowedFrom: "Kabir Vai (Central Store)",
    borrowedBy: "Md. Nasir Ahmed (Finance Secretary)",
    borrowDate: "2024-01-12",
    dueDate: "Permanent Borrow",
    status: "In Use",
    location: "Club Room 302",
    condition: "Good",
    notes: "Comfortable armed seating for weekly competitive programming sessions.",
    updatedAt: "2024-01-12T11:20:00Z",
  },
  {
    id: "dept-eq-5",
    name: "Magnetic Whiteboard (6ft × 4ft)",
    category: "Teaching Aid",
    quantity: 1,
    borrowedFrom: "Dulal Sir (Dept Head)",
    borrowedBy: "Akram Hossen (Executive Member)",
    borrowDate: "2024-02-01",
    dueDate: "Permanent Borrow",
    status: "In Use",
    location: "Club Room 302",
    condition: "Good",
    notes: "Algorithm diagramming, complexity explanations, and problem review board.",
    updatedAt: "2024-02-01T15:00:00Z",
  },
  {
    id: "dept-eq-6",
    name: "Epson Full HD Multimedia Projector",
    category: "Audio/Visual",
    quantity: 1,
    borrowedFrom: "Tarek Sir (Seminar In-Charge)",
    borrowedBy: "Faisal Ahmed (President)",
    borrowDate: "2024-03-10",
    dueDate: "2024-03-25",
    returnDate: "2024-03-24",
    status: "Returned",
    location: "CSE Seminar Lab (Returned)",
    condition: "Good",
    notes: "Borrowed for Intra-MEC Hackathon 2024 presentations. Returned in perfect condition.",
    updatedAt: "2024-03-24T17:30:00Z",
  },
];

export const INITIAL_CLUB_ASSETS: ClubAsset[] = [
  {
    id: "club-asset-1",
    name: "Heavy Brass Club Room Lock & Key Set",
    category: "Security",
    quantity: 1,
    acquisitionDate: "2023-08-10",
    custodian: "Abdullah Zubayer Talukder (Resource & Logistics Manager)",
    location: "Club Room 302 Door",
    status: "In Use",
    condition: "Good",
    estimatedValue: "৳ 850",
    notes: "Includes 3 brass master keys distributed to President, GS, and Lab In-charge.",
    updatedAt: "2023-08-10T09:00:00Z",
  },
  {
    id: "club-asset-2",
    name: "Steel Mesh Document File Holder Organizer",
    category: "Office Supplies",
    quantity: 2,
    acquisitionDate: "2023-09-01",
    custodian: "MEC CC Archive Wing",
    location: "Club Room Cabinet A",
    status: "Available",
    condition: "Good",
    estimatedValue: "৳ 1,200",
    notes: "Keeps constitution papers, member forms, university permissions & receipts organized.",
    updatedAt: "2023-09-01T11:00:00Z",
  },
  {
    id: "club-asset-3",
    name: "Arduino Uno R3 Starter Kits & Sensor Packs",
    category: "Electronics",
    quantity: 5,
    acquisitionDate: "2024-02-14",
    custodian: "Robotics Team Lead",
    location: "Lab Storage Box 3",
    status: "In Use",
    condition: "Excellent",
    estimatedValue: "৳ 8,500",
    notes: "5 complete kits with sensors, servos, breadboards, jumper wires for club workshops.",
    updatedAt: "2024-02-14T16:00:00Z",
  },
  {
    id: "club-asset-4",
    name: "60W Adjustable Soldering Station & Tools",
    category: "Tools",
    quantity: 1,
    acquisitionDate: "2024-03-02",
    custodian: "Hardware Wing Lead",
    location: "Hardware Toolbox B",
    status: "Available",
    condition: "Good",
    estimatedValue: "৳ 2,400",
    notes: "Complete kit with digital multimeter, desoldering pump, lead wire, and stand.",
    updatedAt: "2024-03-02T13:45:00Z",
  },
  {
    id: "club-asset-5",
    name: "Official MEC CC Vinyl Stage Backdrop Banner (10ft × 4ft)",
    category: "Branding",
    quantity: 1,
    acquisitionDate: "2024-01-10",
    custodian: "Event Management Wing",
    location: "Club Room Storage",
    status: "Available",
    condition: "Good",
    estimatedValue: "৳ 2,100",
    notes: "Official high-res club logo banner used for stages, booths, and photo sessions.",
    updatedAt: "2024-01-10T12:00:00Z",
  },
];
