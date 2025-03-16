import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let className = "";

  switch (status) {
    case "Received":
      // Custom success style since it's not in your variants
      variant = "outline";
      className =
        "border-green-400 bg-green-100 text-green-800 hover:bg-green-200";
      break;
    case "Installed":
      variant = "default";
      break;
    case "Damaged":
      variant = "destructive";
      break;
    case "Missing":
      // Custom warning style
      variant = "outline";
      className =
        "border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      break;
    case "Not Received":
      variant = "outline";
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}

// Custom badge for difficulty
export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let className = "";

  switch (difficulty) {
    case "Easy":
      variant = "outline";
      className = "border-green-400 bg-green-50 text-green-700";
      break;
    case "Medium":
      variant = "secondary";
      break;
    case "Hard":
      variant = "destructive";
      break;
    case "N/A":
      variant = "outline";
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {difficulty}
    </Badge>
  );
} 