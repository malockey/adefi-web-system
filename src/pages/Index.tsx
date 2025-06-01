import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Event } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/services/eventService";
import { Skeleton } from "@/components/ui/skeleton";

const EventsPage = () => {
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Events</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Events</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our upcoming events and activities for people with physical disabilities and their families.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
          <h2 className="text-3xl font-bold text-blue-700 mb-4">No events available</h2>
          <p className="text-gray-600 mb-6">
            Be the first to publish an event! Share talks, activities, or meetups with our community.
          </p>
          <Button className="bg-blue-700 hover:bg-blue-800">
            Publish an event
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <h2 className="text-xl font-bold text-blue-700">{event.title}</h2>
              </CardHeader>
              <CardContent className="py-2 flex-grow">
                <p className="line-clamp-3 text-gray-600 mb-2">{event.content}</p>
                <div className="text-sm text-gray-500">
                  <p>By: {event.author}</p>
                  <p>Date: {format(new Date(event.date), "dd/MM/yyyy")}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Read more
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    {selectedEvent && (
                      <>
                        <DialogHeader>
                          <DialogTitle>{selectedEvent.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <img
                            src={selectedEvent.image_url}
                            alt={selectedEvent.title}
                            className="w-full h-60 object-cover rounded-md"
                          />
                          <p className="text-gray-600">{selectedEvent.content}</p>
                          <div className="text-sm text-gray-500">
                            <p>By: {selectedEvent.author}</p>
                            <p>Date: {format(new Date(selectedEvent.date), "dd/MM/yyyy")}</p>
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
      )}

      <div className="mt-12 bg-blue-50 rounded-lg p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Publish your event</h2>
        <p className="text-gray-600 mb-6">
          Are you working with people with disabilities and want to publish an event on our platform?
          Contact us to learn how to share your work with our community.
        </p>
        <Button className="bg-blue-700 hover:bg-blue-800">
          Contact us
        </Button>
      </div>
    </div>
  );
};

export default EventsPage;
