'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePostHog } from 'posthog-js/react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Pencil, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllGuestbookEntries, createGuestbookEntry, type GuestbookEntry } from '@/data/guestbook';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  message: z.string().max(200, {
    message: "Message must not exceed 200 characters.",
  }).optional(),
});

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const posthog = usePostHog();

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  // Load guestbook entries on component mount
  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getAllGuestbookEntries();
        // Sort entries by date (newest first)
        const sortedEntries = [...data].sort((a, b) => 
          new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
        );
        setEntries(sortedEntries);
      } catch (error) {
        console.error('Error loading guestbook entries:', error);
        toast({
          title: "Error",
          description: "Failed to load guestbook entries. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadEntries();
  }, [toast]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newEntry = await createGuestbookEntry({
        name: values.name,
        message: values.message || null,
        visitDate: new Date(),
      });
      
      // Identify the user in PostHog with their name
      if (posthog) {
        posthog.identify(posthog.get_distinct_id(), {
          name: values.name
        });
      }
      
      setEntries([newEntry, ...entries]);
      form.reset();
      
      toast({
        title: "Success!",
        description: "Thank you for signing our guestbook!",
      });
    } catch (error) {
      console.error('Error creating guestbook entry:', error);
      toast({
        title: "Error",
        description: "Failed to sign guestbook. Please try again later.",
        variant: "destructive",
      });
    }
  }

  // No longer using random effects for entries

  return (
    <div className="space-y-8 px-4 py-6 max-w-7xl mx-auto">
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 mb-12">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 py-8">
          <h1 className="text-5xl font-bold tracking-tight">Visitor Guestbook</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            We&apos;re glad you are here! Sign our guestbook and be a part of the journey.
          </p>
          <div className="w-24 h-1 bg-blue-400 rounded-full mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sign Guestbook Form */}
        <Card className="md:col-span-1 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-600" />
              <span>Sign Our Guestbook</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Leave a quick note..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing..." : "Sign Guestbook"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Guestbook Entries Display */}
        <Card className="md:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              <span>Our Visitors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading guestbook entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-center">
                <User className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No entries yet</p>
                <p className="text-gray-500">Be the first to sign our guestbook!</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-blue-700 dark:text-blue-300">{entry.name}</h3>
                          <span className="text-xs text-gray-500">{format(new Date(entry.visitDate), 'MMMM d, yyyy')}</span>
                        </div>
                        {entry.message && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
