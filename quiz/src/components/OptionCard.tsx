interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  /** Visual variant */
  variant?: 'card' | 'pill' | 'yes-no' | 'unsure';
  /** Show checkbox for multi-select */
  showCheckbox?: boolean;
}

export default function OptionCard({
  label,
  selected,
  onClick,
  variant = 'card',
  showCheckbox = false,
}: OptionCardProps) {
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`pill-option ${selected ? 'selected' : ''}`}
      >
        {label}
      </button>
    );
  }

  const isUnsure = variant === 'unsure';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`option-card w-full text-left ${selected ? 'selected' : ''} ${
        isUnsure ? 'col-span-full border-dashed' : ''
      } ${variant === 'yes-no' ? 'justify-center text-center' : ''}`}
    >
      {showCheckbox && (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded border-2 mr-3 flex-shrink-0 transition-colors ${
            selected
              ? 'bg-brand-primary border-brand-primary'
              : 'border-brand-border bg-white'
          }`}
        >
          {selected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
      )}
      <span className="text-[15px] font-medium leading-snug">{label}</span>
    </button>
  );
}
