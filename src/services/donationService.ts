
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
  amount: number;
  date: Date;
  message?: string;
};

export const createDonation = async (donation: CreateDonationRequest): Promise<Donation> => {
  const dbDonation = {
    donor_name: donation.donorName,
    amount: donation.amount,
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
  donorName: dbDonation.donor_name,
  amount: dbDonation.amount,
  date: new Date(dbDonation.date),
  message: dbDonation.message,
});
