'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllGuestbookEntries, type GuestbookEntry } from '@/data/guestbook';

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <div className="flex-1 p-6 md:p-8 pt-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Guestbook</h1>
          <p className="text-muted-foreground">
            View all visitors who have signed the guestbook
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              <span>All Visitors</span>
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
                <p className="text-gray-500">No one has signed the guestbook yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
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
