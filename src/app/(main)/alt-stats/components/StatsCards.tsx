import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Beer, Cigarette, Store, Car } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  unit?: string;
}

function StatCard({ title, value, icon, unit }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="text-xl sm:text-2xl font-bold">
          {value}{unit ? ` ${unit}` : ''}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  beersDrank: number;
  cigarsSmoked: number;
  lowesVisits: number;
  hoursDriven: number;
}

export function StatsCards({
  beersDrank,
  cigarsSmoked,
  lowesVisits,
  hoursDriven,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard 
        title="Beers Drank" 
        value={beersDrank} 
        icon={<Beer size={20} />} 
      />
      <StatCard 
        title="Cigars Smoked" 
        value={cigarsSmoked} 
        icon={<Cigarette size={20} />} 
      />
      <StatCard 
        title="Lowes Visits" 
        value={lowesVisits} 
        icon={<Store size={20} />} 
      />
      <StatCard 
        title="Hours Driven" 
        value={hoursDriven} 
        unit="hrs"
        icon={<Car size={20} />} 
      />
    </div>
  );
}
