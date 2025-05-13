import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Beer, Cigarette, Store, Car, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type StatType } from "@/data/altStats";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  unit?: string;
  statType: StatType;
  onIncrement: (type: StatType) => void;
}

function StatCard({ title, value, icon, unit, statType, onIncrement }: StatCardProps) {
  return (
    <Card 
      className="shadow-sm relative group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={() => onIncrement(statType)}
    >
      <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="text-xl sm:text-2xl font-bold">
          {value}{unit ? ` ${unit}` : ''}
        </div>
      </CardContent>
      
      {/* Add button overlay that appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>Increment</span>
        </Button>
      </div>
    </Card>
  );
}

interface StatsCardsProps {
  beersDrank: number;
  cigarsSmoked: number;
  lowesVisits: number;
  hoursDriven: number;
  onIncrement: (type: StatType) => void;
}

export function StatsCards({
  beersDrank,
  cigarsSmoked,
  lowesVisits,
  hoursDriven,
  onIncrement,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard 
        title="Beers Drank" 
        value={beersDrank} 
        icon={<Beer size={20} />}
        statType="beersDrank"
        onIncrement={onIncrement}
      />
      <StatCard 
        title="Cigars Smoked" 
        value={cigarsSmoked} 
        icon={<Cigarette size={20} />}
        statType="cigarsSmoked"
        onIncrement={onIncrement}
      />
      <StatCard 
        title="Lowes Visits" 
        value={lowesVisits} 
        icon={<Store size={20} />}
        statType="lowesVisits"
        onIncrement={onIncrement}
      />
      <StatCard 
        title="Hours Driven" 
        value={hoursDriven} 
        unit="hrs"
        icon={<Car size={20} />}
        statType="hoursDriven"
        onIncrement={onIncrement}
      />
    </div>
  );
}
