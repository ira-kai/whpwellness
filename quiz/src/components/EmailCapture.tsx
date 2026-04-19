import { useState } from 'react';

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  onSkip: () => void;
}

export default function EmailCapture({ onSubmit, onSkip }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSubmit(email.trim());
  };

  return (
    <div className="quiz-container flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary mb-3">
        Where should we send your results?
      </h2>
      <p className="text-text-secondary text-base mb-8 max-w-md font-body leading-relaxed">
        We'll email you a summary of your personalized recommendation along with
        a special offer.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="your@email.com"
          className="w-full px-4 py-3.5 border-2 border-brand-border rounded-card text-base
                     font-body text-text-primary placeholder:text-text-muted
                     focus:outline-none focus:border-brand-primary transition-colors mb-2"
          autoFocus
        />
        {error && (
          <p className="text-brand-error text-sm text-left mb-2">{error}</p>
        )}

        <button type="submit" className="btn-primary w-full mt-3">
          See My Results
        </button>
      </form>

      <button
        type="button"
        onClick={onSkip}
        className="mt-4 text-text-muted text-sm underline hover:text-text-secondary transition-colors font-body"
      >
        Skip — just show me my results
      </button>
    </div>
  );
}
