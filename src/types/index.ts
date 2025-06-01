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
  donor_name: string;
  donor_doc?: string; // CPF or CNPJ optional
  date: Date;
  registration_date: Date; // date when the donation was registered
  description?: string; // general description of the donation
  has_items?: boolean; // indicate if the donation has items (optional)
  value?: number;
};

export type DonationItem = {
  id: string;
  donation_id: string; // FK → donation.id
  description?: string;
  quantity: number;
};

export type Event = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  image_url?: string;
};
