import BudgetCard from "@/components/Budget";

export default function Dashboard() {
  return (
   <div>
        <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>      
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BudgetCard/>
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