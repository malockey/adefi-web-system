
import { supabase } from '@/lib/supabase';
import { Donation } from '@/types';
import { DbDonation } from '@/types/supabase';

export const fetchDonations = async (): Promise<Donation[]> => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching donations:', error);
    throw new Error('Failed to fetch donations');
  }

  return (data as DbDonation[]).map(mapDbDonationToDonation);
};

export type CreateDonationRequest = {
  donorName: string;
  value: number;
  date: Date;
  message?: string;
};

export const createDonation = async (donation: CreateDonationRequest): Promise<Donation> => {
  const dbDonation = {
    donor_name: donation.donorName,
    value: donation.value,
    date: donation.date.toISOString().split('T')[0],
    message: donation.message,
  };

  const { data, error } = await supabase
    .from('donations')
    .insert(dbDonation)
    .select()
    .single();

  if (error) {
    console.error('Error creating donation:', error);
    throw new Error('Failed to create donation');
  }

  return mapDbDonationToDonation(data as DbDonation);
};

const mapDbDonationToDonation = (dbDonation: DbDonation): Donation => ({
  id: dbDonation.id,
  donor_name: dbDonation.donor_name,
  value: dbDonation.value,
  date: dbDonation.date,
  registration_date: new Date(dbDonation.registration_date),
  description: dbDonation.description,
});
