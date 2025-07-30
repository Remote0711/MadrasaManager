interface ProgressBarProps {
  percentage: number;
  showText?: boolean;
}

export default function ProgressBar({ percentage, showText = true }: ProgressBarProps) {
  const getColor = (percent: number) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = (percent: number) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center">
      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
        <div
          className={`h-2 rounded-full ${getColor(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showText && (
        <span className={`text-sm font-medium ${getTextColor(percentage)}`}>
          {percentage}%
        </span>
      )}
    </div>
  );
}
