import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchDonations, createDonation, CreateDonationRequest } from "@/services/donationService";
import { Skeleton } from "@/components/ui/skeleton";

// Schema do item de doação
const donationItemSchema = z.object({
  name: z.string().min(1, "Nome do item é obrigatório"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantidade deve ser no mínimo 1"),
});

// Schema do formulário
const formSchema = z.object({
  donorName: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  amount: z.coerce.number().positive({ message: "O valor deve ser positivo" }).optional(), // amount será opcional se for item
  date: z.date({
    required_error: "Data da doação é obrigatória",
  }),
  message: z.string().optional(),
  hasItems: z.boolean(),
  items: z.array(donationItemSchema).optional(),
});

type FormData = z.infer<typeof formSchema>;

const Donations = () => {
  const { 
    data: donations = [], 
    isLoading,
    refetch: refetchDonations
  } = useQuery({
    queryKey: ['donations'],
    queryFn: fetchDonations,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: "",
      message: "",
      date: new Date(),
      hasItems: false,
      items: [],
      amount: undefined,
    },
  });

  // Para manipular o array de itens
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const createDonationMutation = useMutation({
    mutationFn: (data: FormData) => createDonation(data as CreateDonationRequest),
    onSuccess: () => {
      toast.success("Doação registrada com sucesso!");
      form.reset({ donorName: "", message: "", date: new Date(), hasItems: false, items: [], amount: undefined });
      refetchDonations();
    },
    onError: (error) => {
      console.error('Error creating donation:', error);
      toast.error("Erro ao registrar doação. Por favor, tente novamente.");
    },
  });

  function onSubmit(values: FormData) {
    // Se tem itens, não envia amount direto, senão envia
    if (values.hasItems && (!values.items || values.items.length === 0)) {
      toast.error("Adicione pelo menos um item para a doação.");
      return;
    }
    createDonationMutation.mutate(values);
  }

  // Calculate total donations amount
  const totalDonations = donations.reduce((sum, donation) => sum + donation.value, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Doações</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Lista de doações recebidas para apoiar nossos projetos e clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-200">Total Arrecadado</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? (
                <Skeleton className="h-8 w-32 bg-blue-500/30" />
              ) : (
                `R$ ${totalDonations.toLocaleString('pt-BR')}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100">
              {isLoading ? (
                <Skeleton className="h-4 w-40 bg-blue-500/30" />
              ) : (
                `De ${donations.length} doações recebidas`
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Faça uma Doação</CardTitle>
            <CardDescription>Apoie nosso trabalho com pessoas com deficiência</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-blue-700 hover:bg-blue-800 flex-1">
              Doar via PIX
            </Button>
            <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50 flex-1">
              Transferência Bancária
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50 flex-1">
                  Outras Formas
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Nova Doação</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={form.control}
                      name="donorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Doador</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do doador ou organização" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasItems"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => field.onChange(checked === true)} 
                            />
                          </FormControl>
                          <FormLabel>Doação possui itens?</FormLabel>
                        </FormItem>
                      )}
                    />

                    {!form.getValues("hasItems") && (
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data da Doação</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Deixe uma mensagem sobre sua doação"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("hasItems") && (
                      <>
                        <CardTitle className="text-lg mt-4">Itens da Doação</CardTitle>
                        {fields.map((item, index) => (
                          <div key={item.id} className="space-y-2 border rounded p-3 mb-3">
                            <FormField
                              control={form.control}
                              name={`items.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome do Item</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nome do item" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Descrição do Item (opcional)</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Descrição" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantidade</FormLabel>
                                  <FormControl>
                                    <Input type="number" min={1} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => remove(index)}
                            >
                              Remover Item
                            </Button>
                          </div>
                        ))}
                        <Button type="button" onClick={() => append({ name: "", description: "", quantity: 1 })}>
                          Adicionar Item
                        </Button>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800"
                      disabled={createDonationMutation.isPending}
                    >
                      {createDonationMutation.isPending ? "Registrando..." : "Registrar Doação"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Doações</CardTitle>
          <CardDescription>
            Lista das doações feitas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </>
          ) : donations.length === 0 ? (
            <p>Nenhuma doação registrada.</p>
          ) : (
            donations.map((donation) => (
              <div key={donation.id} className="border p-3 rounded">
                <p>
                  <strong>{donation.donorName}</strong> - {format(new Date(donation.date), "dd/MM/yyyy")}
                </p>
                {donation.has_items ? (
                  <>
                    <p>Itens doados:</p>
                    <ul className="list-disc list-inside">
                      {donation.items?.map((item, i) => (
                        <li key={i}>
                          {item.quantity}x {item.name} {item.description && `- ${item.description}`}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>Valor: R$ {donation.value?.toFixed(2)}</p>
                )}
                {donation.description && <p>Mensagem: {donation.description}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Donations;
