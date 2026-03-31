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
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-2 py-4 sm:px-4">
      <section>
        <Card className="app-section overflow-hidden">
          <div className="relative p-6 sm:p-8">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('/images/background.JPEG')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,38,0.82),rgba(11,19,38,0.98))]" />
            <div className="relative z-10 max-w-3xl space-y-5">
              <p className="eyebrow-label text-[0.68rem] text-secondary">Visitor Log</p>
              <h1 className="text-4xl font-semibold uppercase leading-none text-foreground sm:text-6xl">
                Guestbook
                <br />
                Entries
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
                Sign the build ledger, leave a note, and mark that you were here for the roadster&apos;s progress.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Sign Guestbook Form */}
        <Card className="app-card md:col-span-1 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 text-2xl uppercase text-foreground">
              <Pencil className="h-5 w-5 text-[hsl(var(--secondary))]" />
              <span>Sign Our Guestbook</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="mb-6 rounded-sm bg-[rgba(19,27,46,0.82)] px-4 py-4">
              <p className="eyebrow-label text-[0.58rem] text-secondary">Current Visitor Count</p>
              <div className="mt-3 font-[var(--font-display)] text-4xl leading-none text-[hsl(var(--secondary))]">
                {entries.length}
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="eyebrow-label text-[0.58rem] text-secondary">Your Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          className="rounded-sm border-0 bg-[rgba(19,27,46,0.9)] text-foreground placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--secondary))]"
                          {...field}
                        />
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
                      <FormLabel className="eyebrow-label text-[0.58rem] text-secondary">Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Leave a quick note..." 
                          className="resize-none rounded-sm border-0 bg-[rgba(19,27,46,0.9)] text-foreground placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--secondary))]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full rounded-sm border-0 bg-[rgba(34,42,61,0.96)] font-[var(--font-display)] text-sm uppercase tracking-[0.12em] text-[hsl(var(--secondary))] shadow-none shadow-[inset_3px_0_0_#E31837] hover:bg-[rgba(49,57,77,0.96)] hover:text-foreground"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing..." : "Sign Guestbook"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Guestbook Entries Display */}
        <Card className="app-card md:col-span-2 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 text-2xl uppercase text-foreground">
              <Book className="h-5 w-5 text-[hsl(var(--secondary))]" />
              <span>Our Visitors</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading guestbook entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <User className="mb-4 h-12 w-12 text-[hsl(var(--muted-foreground))]" />
                <p className="text-lg font-medium text-foreground">No entries yet</p>
                <p className="text-[hsl(var(--muted-foreground))]">Be the first to sign our guestbook.</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="rounded-sm bg-[rgba(19,27,46,0.82)] px-4 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-[var(--font-display)] text-lg uppercase text-foreground">{entry.name}</h3>
                          <span className="eyebrow-label text-[0.52rem] text-[#E31837]">{format(new Date(entry.visitDate), 'MMMM d, yyyy')}</span>
                        </div>
                        {entry.message && (
                          <p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{entry.message}</p>
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
