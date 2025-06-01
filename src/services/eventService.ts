
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { DbEvent } from '@/types/supabase';

export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
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
    author: event.author,
    date: event.date.toISOString(),
    image_url: event.imageUrl,
  };

  const { data, error } = await supabase
    .from('events')
    .insert(dbEvent)
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }

  return mapDbEventToEvent(data as DbEvent);
};

export const uploadEventImage = async (file: File): Promise<string> => {
  const fileName = `event-${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase
    .storage
    .from('event-images')
    .upload(fileName, file);
    
  if (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
  
  const { data: urlData } = supabase
    .storage
    .from('event-images')
    .getPublicUrl(data.path);
    
  return urlData.publicUrl;
};

const mapDbEventToEvent = (dbEvent: DbEvent): Event => ({
  id: dbEvent.id,
  title: dbEvent.title,
  content: dbEvent.content,
  author: dbEvent.author_id,
  date: new Date(dbEvent.date),
  imageUrl: dbEvent.image_url,
});
