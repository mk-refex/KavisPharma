import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import HomeCMS from "./components/HomeCMS";
import AboutCMS from "./components/AboutCMS";
import CareerCMS from "./components/CareerCMS";
import ContactCMS from "./components/ContactCMS";
import UsersCMS from "./components/UsersCMS";

type NotificationType = "success" | "error";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const isAdmin = localStorage.getItem("adminRole") === "admin";

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activePage === "users" && !isAdmin) {
      setActivePage("overview");
    }
  }, [activePage, isAdmin]);

  const showNotification = (
    message: string,
    type: NotificationType = "success",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const pageTitles: Record<string, string> = {
    overview: "Overview",
    home: "Home Page",
    about: "About Page",
    career: "Career Page",
    contact: "Contact Page",
    users: "User Management",
  };

  const renderContent = () => {
    if (activePage === "home") {
      return <HomeCMS showNotification={showNotification} />;
    }

    if (activePage === "about") {
      return <AboutCMS showNotification={showNotification} />;
    }

    if (activePage === "career") {
      return <CareerCMS showNotification={showNotification} />;
    }

    if (activePage === "contact") {
      return <ContactCMS showNotification={showNotification} />;
    }

    if (activePage === "users" && isAdmin) {
      return <UsersCMS showNotification={showNotification} />;
    }

    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-white">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Kavis Pharma CMS</h2>
          <p className="text-white/90 text-sm max-w-2xl">
            Manage website content from this dashboard across Home, About,
            Career, and Contact pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setActivePage("home")}
            className="bg-white rounded-xl border border-background-200 p-5 text-left hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
              <i className="ri-home-line text-xl"></i>
            </div>
            <h3 className="font-semibold text-secondary-900">Home Page</h3>
            <p className="text-sm text-foreground-600 mt-1">
              Edit hero slider, stats, and section images.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActivePage("about")}
            className="bg-white rounded-xl border border-background-200 p-5 text-left hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
              <i className="ri-information-line text-xl"></i>
            </div>
            <h3 className="font-semibold text-secondary-900">About Page</h3>
            <p className="text-sm text-foreground-600 mt-1">
              Edit hero, team, technologies, and all about sections.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActivePage("career")}
            className="bg-white rounded-xl border border-background-200 p-5 text-left hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
              <i className="ri-briefcase-line text-xl"></i>
            </div>
            <h3 className="font-semibold text-secondary-900">Career Page</h3>
            <p className="text-sm text-foreground-600 mt-1">
              Post job openings and manage career page content.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActivePage("contact")}
            className="bg-white rounded-xl border border-background-200 p-5 text-left hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
              <i className="ri-mail-line text-xl"></i>
            </div>
            <h3 className="font-semibold text-secondary-900">Contact Page</h3>
            <p className="text-sm text-foreground-600 mt-1">
              Edit contact details, form labels, and social links.
            </p>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setActivePage("users")}
              className="bg-white rounded-xl border border-background-200 p-5 text-left hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                <i className="ri-team-line text-xl"></i>
              </div>
              <h3 className="font-semibold text-secondary-900">Users</h3>
              <p className="text-sm text-foreground-600 mt-1">
                Manage CMS admins, editors, and account access.
              </p>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <DashboardHeader
          title={pageTitles[activePage] || "Dashboard"}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6">{renderContent()}</main>
      </div>

      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
            notification.type === "success" ? "bg-primary-600" : "bg-red-600"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
