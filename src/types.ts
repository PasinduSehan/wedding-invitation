export interface Invitation {
  id?: string; // Firestore document ID
  familyName: string;
  phone: string;
  email: string;
  token: string;
  pin: string; // 4-digit secure access PIN
  maxGuests: number;
  status: "Pending" | "Coming" | "Not Coming";
  guestCount: number;
  submittedAt: string | null;
  notes?: string;
}

export interface Guest {
  id?: string;
  invitationId: string;
  guestName: string;
  dietaryPreference?: string;
  dietaryRequirements?: string;
}

export interface WeddingTimelineEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  location: string;
  description: string;
  iconName: string; // Lucide icon identifier
}

export interface LoveStoryMilestone {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface DashboardStats {
  totalInvitations: number;
  accepted: number;
  declined: number;
  pending: number;
  totalGuests: number;
}
