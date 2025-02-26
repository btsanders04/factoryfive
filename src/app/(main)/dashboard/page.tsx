import BudgetCard from "@/components/Budget";
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
        individualContributions: [
          {
            user: 'Brandon',
            spent: 0
          },
          {
            user: 'Jared',
            spent: 1000
          },
        ]
      },
      {
        name: "Engine and Transmission",
        budget: 26000,
        individualContributions: [
        {
          user: 'Brandon',
          spent: 0
        },
        {
          user: 'Jared',
          spent: 1000
        }]
      },
      {
        name: "Shipping",
        budget: 730,
        individualContributions: []
      },
      {
        name: "Tools",
        budget: 730,
        individualContributions: []
      }
    ]
  };

export default function Dashboard() {
  return (
   <div>
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
    </div>
  );
}