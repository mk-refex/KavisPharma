import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/api";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function DashboardHeader({
  title,
  onMenuClick,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const adminName = localStorage.getItem("adminName") || "Admin";
  const adminEmail = localStorage.getItem("adminEmail") || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-background-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-background-100 text-foreground-700"
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        <div>
          <p className="text-xs uppercase tracking-wide text-foreground-500">
            Kavis Pharma CMS
          </p>
          <h1 className="text-lg font-semibold text-secondary-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          <i className="ri-external-link-line"></i>
          Visit Website
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-100"
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground-800">
              {adminName}
            </span>
            <i className="ri-arrow-down-s-line text-foreground-500"></i>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-background-200 py-2">
              <div className="px-4 py-2 border-b border-background-100">
                <p className="text-sm font-semibold text-foreground-900">
                  {adminName}
                </p>
                <p className="text-xs text-foreground-500 truncate">
                  {adminEmail}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <i className="ri-logout-box-r-line"></i>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
