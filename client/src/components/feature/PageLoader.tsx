import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LOGO_SRC = 'https://kavispharma.com/wp-content/uploads/2024/06/logo.png';

export default function PageLoader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    setVisible(true);
    const delay = isFirstLoad.current ? 1100 : 450;
    isFirstLoad.current = false;
    const timer = window.setTimeout(() => setVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="page-loader fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0D77B2]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative flex h-28 w-28 items-center justify-center md:h-32 md:w-32">
        <span className="page-loader-ring absolute inset-0 rounded-full border-2 border-white/25 border-t-white" />
        <img
          src={LOGO_SRC}
          alt="Kavis Pharma"
          className="page-loader-logo relative z-10 h-12 w-auto md:h-14"
        />
      </div>
      <span className="mt-4 text-[10px] font-medium tracking-[0.35em] text-white/90 uppercase">
        Kavis Pharma
      </span>
    </div>
  );
}
