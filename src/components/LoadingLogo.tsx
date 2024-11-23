import { cn } from "@/lib/utils";

interface LoadingLogoProps {
  className?: string;
  message?: string;
}

const LoadingLogo = ({ className, message = "Hang tight! We're loading your AI-powered stock analysis..." }: LoadingLogoProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6 space-y-4", className)}>
      <div className="relative w-16 h-16 animate-spin">
        <img
          src="/lovable-uploads/02a36ddb-5f73-4f42-94d9-4f30ad0f22da.png"
          alt="Loading"
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-muted-foreground text-center animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingLogo;