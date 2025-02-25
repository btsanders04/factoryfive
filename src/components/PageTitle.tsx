// Page title component with optional gradient divider
export const PageTitle = ({ 
  title, 
  subtitle, 
  showDivider = true 
}: { 
  title: string; 
  subtitle?: string;
  showDivider?: boolean;
}) => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      {showDivider && (
        <div className="mt-6">
          <div className="app-divider" />
        </div>
      )}
    </div>
  );
};