import type { ReactNode } from "react";
import type { CSSProperties } from "react";

export const PhoneLayout = ({ children }: { children: ReactNode }) => {
  return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--app-bg)]">
        <div
          className="
          w-[390px] h-screen bg-[var(--surface)] text-[var(--text)]
          rounded-3xl shadow-2xl
          flex flex-col overflow-hidden
          font-sans
        "
        style={{ "--phone-width": "390px" } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
};
