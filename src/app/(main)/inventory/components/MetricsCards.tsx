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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <Card className="shadow-sm">
        <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm font-medium">
            Total Parts
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="text-xl sm:text-2xl font-bold">{totalParts}</div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm font-medium">
            Parts Received
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="text-xl sm:text-2xl font-bold">
            {receivedParts} / {totalParts}
          </div>
          <Progress value={receivedPercentage} className="h-2 mt-2" />
          <p className="text-xs text-gray-500 mt-1">
            {receivedPercentage}% complete
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-sm sm:col-span-2 md:col-span-1">
        <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm font-medium">
            Parts Installed
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="text-xl sm:text-2xl font-bold">
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