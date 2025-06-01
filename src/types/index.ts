export type Person = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string; 
  neigh?: string; // neighborhood
  birth_date?: Date;
  disability?: string; // can be an enum in the database
  is_admin: boolean;
  notes?: string;
  registration_date: Date;
};

export type Appointment = {
  id: string;
  person_id: string;
  date: Date;
  time: string;
  duration: string; // in minutes
  status: string;
  notes?: string;
};

export type Donation = {
  id: string;
  donorName: string;
  donorDocument?: string;
  date: string;
  description?: string;
  has_items: boolean;
  notes?: string;
  items?: DonationItem[];
  value?: number; // monetary value of the donation, if applicable
};

export type DonationItem = {
  id: string;
  donation_id: string;
  name: string;
  description?: string;
  quantity: number;
  registration_date: string;
};

export type Event = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  image_url?: string;
};
