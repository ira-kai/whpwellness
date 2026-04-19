interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="quiz-container flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4 leading-tight">
        Your Personalized Wellness Assessment
      </h1>
      <p className="text-text-secondary text-base sm:text-lg mb-8 max-w-md leading-relaxed font-body">
        Answer a few quick questions and we'll recommend the right protocol for
        you. Takes about 2 minutes.
      </p>
      <button type="button" onClick={onStart} className="btn-primary text-base">
        Start My Assessment
      </button>
    </div>
  );
}
