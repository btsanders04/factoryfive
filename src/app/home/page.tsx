import BudgetCard from "@/components/Budget";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Sidebar } from "@/components/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Home | My Next.js App',
  description: 'Welcome to my Next.js application with mobile-friendly navigation',
}
 const budgetData = {
    month: "February",
    year: "2025",
    categories: [
      {
        name: "Kit",
        spent: 5303,
        budget: 45000,
      },
      {
        name: "Engine and Transmission",
        spent: 6646,
        budget: 26000
      },
      {
        name: "Shipping",
        spent: 1350,
        budget: 730
      },
      {
        name: "Tools",
        spent: 1350,
        budget: 730
      }
    ]
  };

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop left sidebar - hidden on mobile */}
      <div className="hidden md:block w-64 border-l">
        <Sidebar />
      </div>
      {/* Mobile navigation - visible only on mobile */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>

      {/* Main content area */}
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BudgetCard {...budgetData} />
          {/* Example content cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="p-4 border rounded-lg bg-card text-card-foreground shadow"
            >
              <h3 className="font-medium mb-2">Card {item}</h3>
              <p className="text-sm text-muted-foreground">
                This is some example content for card {item}.
              </p>
            </div>
          ))}
        
          
        </div>
      </main> 
    </div>
  );
}