import { supabase } from "@/lib/supabase";
import { Appointment } from "@/types";
import { DbAppointment } from "@/types/supabase";
import { getClient } from "./clientService";
import { format } from "date-fns";

// Fetch all appointments, mapped to frontend types
export const fetchAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from("appointment")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw new Error("Erro ao buscar agendamentos");
  }

  const appointments = await Promise.all(
    (data as DbAppointment[]).map(async (dbAppointment) => {
      let personName = "";

      try {
        const person = await getClient(dbAppointment.person_id);
        personName = person?.name || "Pessoa desconhecida";
      } catch {
        personName = "Pessoa desconhecida";
      }

      return mapDbAppointmentToAppointment({
        ...dbAppointment,
        person_name: personName, // Adiciona nome temporário pro front
      });
    })
  );

  return appointments;
};

// Create new appointment
export const createAppointment = async (appointment: Omit<Appointment, "id">
): Promise<Appointment> => {
  const dbAppointment = {
    person_id: appointment.person_id,
    date: format(appointment.date, "yyyy-MM-dd"), // ← conversão correta
    time: appointment.time,
    duration: appointment.duration,
    status: 'Confirmado',
    notes: appointment.notes,
  };

  console.log("Criando agendamento:", dbAppointment);

  const { data, error } = await supabase
    .from("appointment")
    .insert(dbAppointment)
    .select()
    .single();

  console.log("Resposta do Supabase:", data, error);

  if (error) {
    console.error("Erro ao criar agendamento:", error);
    throw new Error("Erro ao criar agendamento");
  }

  const person = await getClient(data.person_id);

  return mapDbAppointmentToAppointment({
    ...data,
    person_name: person?.name || "Pessoa desconhecida",
  } as DbAppointment & { person_name?: string });
};

// Update an appointment
export const updateAppointment = async (
  appointment: DbAppointment
): Promise<Appointment> => {
  const dbAppointment = {
    person_id: appointment.person_id,
    date: format(appointment.date, "yyyy-MM-dd"), // ← conversão correta
    time: appointment.time,
    duration: appointment.duration,
    status: appointment.status,
    notes: appointment.notes,
  };

  const { data, error } = await supabase
    .from("appointment")
    .update(dbAppointment)
    .eq("id", appointment.id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar agendamento:", error);
    throw new Error("Erro ao atualizar agendamento");
  }

  const person = await getClient(data.person_id);

  return mapDbAppointmentToAppointment({
    ...data,
    person_name: person?.name || "Pessoa desconhecida",
  } as DbAppointment & { person_name?: string });
};

// Delete an appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  const { error } = await supabase.from("appointment").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar agendamento:", error);
    throw new Error("Erro ao deletar agendamento");
  }
};

// Mapper function
const mapDbAppointmentToAppointment = (
  dbAppointment: DbAppointment & { person_name?: string }
): Appointment => ({
  id: dbAppointment.id,
  person_id: dbAppointment.person_id,
  date: dbAppointment.date,
  time: dbAppointment.time,
  duration: dbAppointment.duration,
  status: dbAppointment.status,
  notes: dbAppointment.notes,
});
