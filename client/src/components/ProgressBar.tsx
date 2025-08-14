interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="flex-1 max-w-md mx-4">
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          className="bg-medical-blue h-2 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        {Math.round(percentage)}% complété
      </div>
    </div>
  );
}
