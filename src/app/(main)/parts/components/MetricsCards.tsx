import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricsCardsProps {
  totalParts: number;
  receivedParts: number;
  installedParts: number;
  receivedPercentage: number;
  installedPercentage: number;
}

export function MetricsCards({
  totalParts,
  receivedParts,
  installedParts,
  receivedPercentage,
  installedPercentage,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Parts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Parts Received
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {receivedParts} / {totalParts}
          </div>
          <Progress value={receivedPercentage} className="h-2 mt-2" />
          <p className="text-xs text-gray-500 mt-1">
            {receivedPercentage}% complete
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Parts Installed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {installedParts} / {totalParts}
          </div>
          <Progress value={installedPercentage} className="h-2 mt-2" />
          <p className="text-xs text-gray-500 mt-1">
            {installedPercentage}% complete
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 