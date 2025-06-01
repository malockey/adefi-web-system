// src/pages/ClientRegistration.tsx

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, differenceInYears, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createClient, CreateClientRequest } from "@/services/clientService";

// Validação do formulário usando city e neigh
const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  age: z.coerce
    .number()
    .min(1, { message: "Idade inválida" })
    .max(120, { message: "Idade inválida" }),
  disabilityType: z
    .string()
    .min(1, { message: "Selecione um tipo de deficiência" }),
  city: z.string().min(3, { message: "Cidade é obrigatória" }),
  neigh: z.string().min(2, { message: "Bairro é obrigatório" }),
  email: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.date({ required_error: "Data de nascimento é obrigatória" }),
  notes: z.string().optional(),
  isAdmin: z.boolean().default(false),
  registrationDate: z.date().default(() => new Date()),
});

type FormData = z.infer<typeof formSchema>;

const ClientRegistration = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      neigh: "",
      email: "",
      phone: "",
      isAdmin: false,
      notes: "",
      disabilityType: "",
      birthDate: undefined,
      age: undefined,
    },
  });

  // Atualiza a idade quando a data de nascimento muda
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "birthDate" && value.birthDate) {
        let birthDateObj: Date;
        if (typeof value.birthDate === "string") {
          birthDateObj = parseISO(value.birthDate);
        } else {
          birthDateObj = value.birthDate;
        }
        const idadeCalculada = differenceInYears(new Date(), birthDateObj);
        form.setValue("age", idadeCalculada);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const createClientMutation = useMutation({
    mutationFn: (data: FormData) => createClient(data as CreateClientRequest),
    onSuccess: () => {
      toast.success("Cliente cadastrado com sucesso!");
      form.reset();
    },
    onError: (error) => {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Erro ao cadastrar cliente. Por favor, tente novamente.");
    },
  });

  function onSubmit(values: FormData) {
    createClientMutation.mutate(values);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Cadastro de Cliente
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Preencha o formulário abaixo para cadastrar um novo cliente.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data de nascimento e idade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        name={field.name}
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val ? new Date(val) : undefined);
                        }}
                        onBlur={field.onBlur}
                        max={format(new Date(), "yyyy-MM-dd")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tipo de deficiência */}
            <FormField
              control={form.control}
              name="disabilityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de deficiência</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de deficiência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="motora">Motora</SelectItem>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditiva">Auditiva</SelectItem>
                      <SelectItem value="intelectcual">Intelectual</SelectItem>
                      <SelectItem value="multipla">Múltipla</SelectItem>
                      <SelectItem value="mental">Mental</SelectItem>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="outra">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cidade e Bairro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neigh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contato */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informações de contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contato */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informações de contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre o cliente"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão de envio */}
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={createClientMutation.isPending}
            >
              {createClientMutation.isPending
                ? "Cadastrando..."
                : "Cadastrar Cliente"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ClientRegistration;
