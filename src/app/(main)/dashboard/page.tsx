import BudgetCard from "@/app/(main)/dashboard/Budget";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BudgetCard />
        {/* Example content cards */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="shadow">
            <CardHeader>
              <CardTitle>Card {item}</CardTitle>
              <CardDescription>Card {item} description</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is some example content for card {item}.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Last updated: Today
              </p>
              <button className="text-xs text-primary-400 hover:text-primary-600">
                View details
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
