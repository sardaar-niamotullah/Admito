export type HoldStatus = "HELD" | "CONFIRMED" | "EXPIRED" | "CANCELLED";

export interface ClassItem {
  id: string;
  name: string;
  totalSeats: number;
  heldSeats: number;
  confirmedSeats: number;
  availableSeats: number;
}

export interface MyHold {
  holdId: string;
  classId: string;
  className: string;
  status: HoldStatus;
  expiresAt: string;
}
