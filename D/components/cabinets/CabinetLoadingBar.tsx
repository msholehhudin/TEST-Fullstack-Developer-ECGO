import { Loader2 } from "lucide-react";

export function CabinetLoadingBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden">
      <div className="cabinet-loading-bar-track h-full w-1/3 rounded-full bg-neutral-500" />
      <style>{`
        @keyframes cabinet-loading-bar-slide {
          0% { transform: translateX(-100%); }
          55% { transform: translateX(180%); }
          100% { transform: translateX(380%); }
        }
        .cabinet-loading-bar-track {
          animation: cabinet-loading-bar-slide 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
