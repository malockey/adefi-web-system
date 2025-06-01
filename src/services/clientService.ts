
import { supabase } from '@/lib/supabase';
import { Person } from '@/types';
import { DbPerson } from '@/types/supabase';

export const fetchPersons = async (): Promise<Person[]> => {
  const { data, error } = await supabase
    .from('person')
    .select('*')
    .order('registration_date', { ascending: true });

  if (error) {
    console.error('Error fetching person:', error);
    throw new Error('Failed to fetch persons');
  }

  return (data as DbPerson[]).map(mapDbClientToClient);
};

export type CreateClientRequest = {
  name: string;
  email?: string;
  phone?: string;
  city?: string; 
  neigh?: string; // neighborhood
  birth_date?: Date;
  age?: number; // calculated from birthDate
  disability?: string; // can be an enum in the database
  is_admin: boolean;
  notes?: string;
  registration_date: Date;
};

export const createClient = async (person: CreateClientRequest): Promise<Person> => {
  const DbPerson = {
    name: person.name,
    email: person.email,
    phone: person.phone,
    city: person.city,
    neigh: person.neigh,
    birth_ate: person.birth_date,
    disability: person.disability,
    is_admin: person.is_admin,
    notes: person.notes,
    registration_date: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('person')
    .insert(DbPerson)
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    throw new Error('Failed to create client');
  }

  return mapDbClientToClient(data as DbPerson);
};

export const getClient = async (id: string): Promise<Person | null> => {
  const { data, error } = await supabase
    .from('person')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching client:', error);
    throw new Error('Failed to fetch client');
  }

  return mapDbClientToClient(data as DbPerson);
};

const mapDbClientToClient = (dbPerson: DbPerson): Person => ({
  id: dbPerson.id,
  name: dbPerson.name,
  email: dbPerson.email,
  phone: dbPerson.phone,
  city: dbPerson.city,
  neigh: dbPerson.neigh,
  disability: dbPerson.disability,
  notes: dbPerson.notes,
  birth_date: dbPerson.birth_date ? new Date(dbPerson.birth_date) : undefined,
  registration_date: new Date(dbPerson.registration_date),
  is_admin: dbPerson.is_admin,
});

