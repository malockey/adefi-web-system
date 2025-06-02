import React, { useState } from "react";
import {
  Card, CardContent, CardFooter, CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEvents, createEvent } from "@/services/eventService";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EventsPage = () => {
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    content: "",
    author_name: "",
    date: "",
    image_url: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.content || !newEvent.author_name || !newEvent.date) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    mutation.mutate({
      ...newEvent,
      date: new Date(newEvent.date),
    });

    setNewEvent({
      title: "",
      content: "",
      author_name: "",
      date: "",
      image_url: "",
    });
  };

  const renderCreateEventDialog = (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800">
          Publique um evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar novo evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" value={newEvent.title} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="content">Descrição</Label>
            <Textarea id="content" name="content" value={newEvent.content} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="author_name">Autor</Label>
            <Input id="author_name" name="author_name" value={newEvent.author_name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="date">Data</Label>
            <Input id="date" name="date" type="date" value={newEvent.date} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="image_url">Imagem (URL, opcional)</Label>
            <Input id="image_url" name="image_url" value={newEvent.image_url} onChange={handleInputChange} />
          </div>
          <Button
            onClick={handleCreateEvent}
            className="w-full mt-2 bg-blue-700 hover:bg-blue-800"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Criando..." : "Criar evento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Eventos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Falha ao carregar os eventos. Tente novamente mais tarde.</p>
        </div>
        {renderCreateEventDialog}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Eventos</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Confira nossos eventos e atividades destinados a pessoas com deficiência e suas famílias.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
              </CardHeader>
              <CardContent className="py-2 flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <div className="text-sm text-gray-500">
                  <Skeleton className="h-3 w-1/3 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Nenhum evento disponível</h2>
          <p className="text-gray-600 mb-6">
            No momento, não há eventos cadastrados. Volte mais tarde ou publique seu próprio evento.
          </p>
          {renderCreateEventDialog}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {events.map(event => (
              <Card
                key={event.id}
                className={`overflow-hidden h-full flex flex-col transition-all ${
                  selectedEvent?.id === event.id ? "scale-105 shadow-lg" : ""
                }`}
              >
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-bold text-blue-700">{event.title}</h2>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <p className="line-clamp-3 whitespace-pre-wrap text-gray-600 mb-2">
                    {event.content}
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Por: {event.author_name}</p>
                    <p>Data: {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog onOpenChange={open => !open && setSelectedEvent(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        Leia mais
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      {selectedEvent && (
                        <>
                          <DialogHeader>
                            <DialogTitle>{selectedEvent.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {selectedEvent.image_url && (
                              <img
                                src={selectedEvent.image_url}
                                alt={selectedEvent.title}
                                className="w-full h-60 object-cover rounded-md"
                              />
                            )}
                            <p className="text-gray-600 whitespace-pre-wrap">
                              {selectedEvent.content}
                            </p>
                            <div className="text-sm text-gray-500">
                              <p>Por: {selectedEvent.author_name}</p>
                              <p>Data: {format(new Date(selectedEvent.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-8 shadow-sm text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Publique seu evento</h2>
            <p className="text-gray-600 mb-6">
              Você trabalha com pessoas com deficiência e quer divulgar um evento na nossa plataforma?
              Cadastre seu evento agora e compartilhe seu trabalho com a comunidade.
            </p>
            {renderCreateEventDialog}
          </div>
        </>
      )}
    </div>
  );
};

export default EventsPage;