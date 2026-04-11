import { LoadingSpinner } from "./LoadingSpinner";

export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <LoadingSpinner size="lg" />
    </div>
  );
};