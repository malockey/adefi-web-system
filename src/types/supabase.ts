export type DbPerson = {
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

export type DbAppointment = {
  id: string;
  person_id: string; // FK → person.id
  date: Date;
  time: string;
  duration: string; // in minutes
  status: string;
  notes?: string;
};

export type DbDonation = {
  id: string;
  donorName: string;
  donor_document?: string; // CPF or CNPJ optional
  date: string;
  description?: string; // general description of the donation
  has_items: boolean;
  notes?: string;
  value?: number;
};

export type DbDonationItem = {
  id: string;
  donation_id: string; // FK → donation.id
  name: string;
  description?: string;
  quantity: number;
  registration_date: string;
};

export type DbEvent = {
  id: string;
  title: string;
  content: string;
  author_id: string; // FK → person.id
  date: string;
  image_url?: string;
};
