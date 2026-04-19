interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary font-body">
          Question {current} of {total}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '4px', backgroundColor: '#E2E8F0' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: '#2F3D4F' }}
        />
      </div>
    </div>
  );
}
