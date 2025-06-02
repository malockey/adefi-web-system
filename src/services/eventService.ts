import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { DbEvent } from '@/types/supabase';

export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }

  return (data as DbEvent[]).map(mapDbEventToEvent);
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  const dbEvent = {
    title: event.title,
    content: event.content,
    author_name: event.author_name,
    date: event.date.toISOString(),
    image_url: event.image_url,
  };

  const { data, error } = await supabase
    .from('event')
    .insert(dbEvent)
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }

  return mapDbEventToEvent(data as DbEvent);
};

const mapDbEventToEvent = (dbEvent: DbEvent): Event => ({
  id: dbEvent.id,
  title: dbEvent.title,
  content: dbEvent.content,
  author_name: dbEvent.author_name,
  date: new Date(dbEvent.date),
  image_url: dbEvent.image_url,
});
