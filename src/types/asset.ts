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

export const INITIAL_BORROWED_EQUIPMENT: BorrowedEquipment[] = [];

export const INITIAL_CLUB_ASSETS: ClubAsset[] = [];

