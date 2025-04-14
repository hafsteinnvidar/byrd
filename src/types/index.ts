export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl?: string;
  includesTransportation: boolean;
  includesMeal: boolean;
  notes?: string;
}

export interface DayItinerary {
  id: string;
  date: string;
  activities: Activity[];
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  coverImageUrl?: string;
  days: DayItinerary[];
  travelAgency: string;
  userId: string;
} 