"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "sonner";

import { fetchPersons } from "@/services/clientService";
import {
  fetchAppointments,
  createAppointment,
} from "@/services/appointmentService";
import { Appointment, Person } from "@/types/index";

const formSchema = z.object({
  person_id: z.string({ required_error: "Selecione um cliente" }),
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.string({ required_error: "Selecione o horário" }),
  duration: z.string({ required_error: "Selecione a duração" }),
  type: z.string({ required_error: "Selecione o tipo de sessão" }),
  status: z.string({ required_error: "Selecione o tipo de status" }).default("Confirmado"),
  notes: z.string().optional(),
});

const Appointments = () => {
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<
    Person[]
  >({
    queryKey: ["clients"],
    queryFn: fetchPersons,
  });

  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const client = clients.find((c) => c.id === values.person_id);
      if (!client) throw new Error("Cliente não encontrado");

      return createAppointment({
        person_id: values.person_id,
        date: values.date, // ← transforma para 'YYYY-MM-DD'
        time: values.time,
        duration: values.duration,
        status: "Confirmado", // Default status
        notes: values.notes,
      });
    },
    onSuccess: () => {
      toast.success("Sessão agendada com sucesso!");
      form.reset();
      refetchAppointments();
    },
    onError: () => {
      toast.error("Erro ao agendar sessão. Tente novamente.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAppointmentMutation.mutate(values);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Agendamentos</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Agende sessões e veja os próximos atendimentos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Novo Agendamento</CardTitle>
              <CardDescription>
                Agende uma nova sessão para um cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="person_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isLoadingClients}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              readOnly
                              placeholder="dd/mm/yyyy"
                              value={
                                field.value
                                  ? format(field.value, "dd/MM/yyyy")
                                  : ""
                              }
                              onBlur={field.onBlur}
                              onClick={(e) => {
                                e.preventDefault();
                                const button =
                                  e.currentTarget.parentElement?.querySelector(
                                    "button"
                                  );
                                button?.click();
                              }}
                              className="pr-10 cursor-pointer bg-white"
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                  <CalendarIcon className="h-4 w-4" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value ?? undefined}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  locale={ptBR}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[
                                "08:00",
                                "09:00",
                                "10:00",
                                "11:00",
                                "14:00",
                                "15:00",
                                "16:00",
                                "17:00",
                              ].map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Duração" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[
                                "30 minutos",
                                "45 minutos",
                                "60 minutos",
                                "90 minutos",
                              ].map((duration) => (
                                <SelectItem key={duration} value={duration}>
                                  {duration}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Sessão</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de sessão" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "Fisioterapia",
                              "Terapia Ocupacional",
                              "Fonoaudiologia",
                              "Psicoterapia",
                              "Consulta Médica",
                              "Outro",
                            ].map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informações adicionais sobre a sessão"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} disabled>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Confirmado"/>
                            </SelectTrigger>
                          </FormControl>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Agendar Sessão
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>
                Veja as próximas sessões marcadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <Skeleton className="h-24 w-full rounded-md" />
              ) : appointments.length === 0 ? (
                <p>Nenhuma sessão agendada.</p>
              ) : (
                <ul className="space-y-4">
                  {appointments.map((appointment) => {
                    const client = clients.find(
                      (c) => c.id === appointment.person_id
                    );
                    return (
                      <li
                        key={appointment.id}
                        className="border p-4 rounded-md"
                      >
                        <p>
                          <strong>Cliente:</strong>{" "}
                          {client ? client.name : "Desconhecido"}
                        </p>
                        <p>
                          <strong>Data:</strong>{" "}
                          {format(new Date(appointment.date), "dd/MM/yyyy")}
                        </p>
                        <p>
                          <strong>Horário:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong>Duração:</strong> {appointment.duration}
                        </p>
                        <p>
                          <strong>Status:</strong> {appointment.status}
                        </p>
                        {appointment.notes && (
                          <p>
                            <strong>Notas:</strong> {appointment.notes}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
