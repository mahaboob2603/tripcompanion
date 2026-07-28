import { AlertTriangle, RefreshCw, ServerCrash, WifiOff, Clock } from 'lucide-react';

export function ErrorState({ error, onRetry, onReset }) {
  let title = "Something went wrong";
  let message = error.message || "An unexpected error occurred.";
  let Icon = AlertTriangle;

  if (error.kind === 'timeout') {
    title = "This is taking too long";
    message = "Our AI is taking longer than expected to curate your trip. Please try again.";
    Icon = Clock;
  } else if (error.kind === 'upstream') {
    title = "AI Service Unavailable";
    message = "The trip curation service is currently overloaded. Give it a moment and try again.";
    Icon = ServerCrash;
  } else if (error.kind === 'network') {
    title = "Connection Error";
    message = "We couldn't connect to the server. Please check your internet connection.";
    Icon = WifiOff;
  }

  return (
    <div className="min-h-screen bg-[var(--color-neutral)] flex flex-col items-center justify-center p-4">
      
      <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-lg border border-[var(--color-error)]/20 text-center animate-[fade-in-up_0.3s_ease-out]">
        
        <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/10 text-[var(--color-error)] mx-auto flex items-center justify-center mb-6">
          <Icon size={32} />
        </div>

        <h2 className="text-2xl font-headline font-bold text-[var(--color-secondary)] mb-3">
          {title}
        </h2>
        
        <p className="text-[var(--color-secondary)]/80 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[var(--color-primary)] text-white font-bold transition-transform hover:-translate-y-0.5 shadow-md"
            >
              <RefreshCw size={18} /> Try Again
            </button>
          )}
          
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] font-bold hover:bg-[var(--color-secondary)]/5 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
