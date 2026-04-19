import type { QuizResult, SafetyFlags } from '../types';

interface ResultsScreenProps {
  result: QuizResult;
  safetyFlags: SafetyFlags;
}

const CONFIDENCE_MESSAGES = {
  high: 'Based on your answers, we have a strong recommendation for you.',
  medium: "Here's what we'd suggest as a great starting point.",
  low: "Based on what you've shared, here's where we'd start.",
};

const MED_TYPE_LABELS: Record<string, string> = {
  'blood-sugar': 'blood sugar medication',
  'blood-thinners': 'blood thinners',
  thyroid: 'thyroid medication',
  hormones: 'hormone therapy',
  cholesterol: 'cholesterol medication',
  other: 'prescription medication',
};

export default function ResultsScreen({
  result,
  safetyFlags,
}: ResultsScreenProps) {
  const { primary, secondary, tertiary, confidenceLevel } = result;

  const isPregnant =
    safetyFlags.pregnant === 'yes' || safetyFlags.pregnant === 'trying';

  return (
    <div className="quiz-container animate-fade-in pb-12">
      {/* Confidence header */}
      <p className="text-text-muted text-sm font-body mb-2 text-center">
        {CONFIDENCE_MESSAGES[confidenceLevel]}
      </p>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-1 text-center">
        Your Recommendation
      </h1>

      {/* Pregnancy banner */}
      {isPregnant && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-card">
          <p className="text-amber-900 text-sm font-body leading-relaxed">
            <strong>Important:</strong>{' '}
            {safetyFlags.pregnant === 'yes'
              ? 'Congratulations! Because you\u2019re pregnant or nursing, please consult your healthcare provider before starting any new supplement regimen.'
              : 'Because you\u2019re trying to conceive, please consult your healthcare provider before starting any new supplement regimen.'}{' '}
            Dr. Nischal is available for a personalized consultation to discuss
            what\u2019s safe and beneficial for you right now.
          </p>
        </div>
      )}

      {/* Medication safety disclaimer */}
      {safetyFlags.takingMedications && safetyFlags.medicationTypes.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-card">
          <p className="text-blue-900 text-sm font-body leading-relaxed">
            <strong>Note:</strong> Because you're taking{' '}
            {safetyFlags.medicationTypes
              .map((t) => MED_TYPE_LABELS[t] ?? t)
              .join(', ')}
            , we recommend discussing these supplements with your healthcare
            provider before starting.
          </p>
        </div>
      )}

      {/* Primary recommendation */}
      <div className="mt-8 bg-white border border-brand-border rounded-result p-6 shadow-result">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="text-brand-secondary text-xs font-semibold uppercase tracking-wider font-body mb-1">
              Recommended for you
            </p>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary">
              {primary.bundle.name}
            </h2>
          </div>
          <span className="text-2xl font-bold text-text-primary font-body">
            ${primary.bundle.price}
          </span>
        </div>

        <p className="text-text-secondary text-sm font-body leading-relaxed mb-4">
          {primary.bundle.tagline}
        </p>
        <p className="text-text-secondary text-sm font-body leading-relaxed mb-6">
          {primary.bundle.description}
        </p>

        {/* Product list */}
        <div className="border-t border-brand-border-light pt-4 mb-6">
          <h3 className="text-sm font-semibold text-text-primary font-body mb-3">
            What's included:
          </h3>
          <ul className="space-y-2">
            {primary.bundle.products.map((product) => (
              <li key={product.name} className="flex gap-2">
                <span className="text-brand-success mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div>
                  <span className="text-sm font-medium text-text-primary font-body">
                    {product.name}
                  </span>
                  <span className="text-sm text-text-muted font-body">
                    {' \u2014 '}
                    {product.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        {isPregnant ? (
          <a
            href="https://www.whpwellness.com/consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block text-center w-full sm:w-auto"
          >
            Book a Consultation
          </a>
        ) : (
          <a
            href={`https://www.whpwellness.com/product/${primary.bundle.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block text-center w-full sm:w-auto"
          >
            Add to Cart
          </a>
        )}
      </div>

      {/* Secondary recommendation */}
      {secondary && (
        <div className="mt-6 bg-white border border-brand-border rounded-result p-5 shadow-card">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider font-body mb-1">
            You might also benefit from
          </p>
          <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              {secondary.bundle.name}
            </h3>
            <span className="text-lg font-bold text-text-primary font-body">
              ${secondary.bundle.price}
            </span>
          </div>
          <p className="text-text-secondary text-sm font-body leading-relaxed mb-4">
            {secondary.bundle.tagline}
          </p>
          <a
            href={`https://www.whpwellness.com/product/${secondary.bundle.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-block text-center"
          >
            Learn More
          </a>
        </div>
      )}

      {/* Tertiary mention */}
      {tertiary && (
        <div className="mt-4 px-5 py-3 bg-brand-bg-secondary rounded-card">
          <p className="text-text-secondary text-sm font-body">
            Some of your answers also suggest{' '}
            <a
              href={`https://www.whpwellness.com/product/${tertiary.bundle.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary font-medium underline hover:text-brand-primary-dark"
            >
              {tertiary.bundle.name}
            </a>{' '}
            could be helpful.
          </p>
        </div>
      )}

      {/* Consultation CTA */}
      <div className="mt-10 text-center border-t border-brand-border-light pt-8">
        <p className="text-text-secondary text-sm font-body leading-relaxed max-w-md mx-auto mb-4">
          Want a deeper dive? Book a consultation with Dr. Nischal to discuss a
          personalized protocol tailored to your unique needs.
        </p>
        <a
          href="https://www.whpwellness.com/consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-block"
        >
          Book a Consultation
        </a>
      </div>
    </div>
  );
}
