interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onPageChange: (page: string) => void;
}

const pages = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-line", adminOnly: false },
  { id: "home", label: "Home", icon: "ri-home-line", adminOnly: false },
  { id: "about", label: "About", icon: "ri-information-line", adminOnly: false },
  { id: "career", label: "Career", icon: "ri-briefcase-line", adminOnly: false },
  { id: "contact", label: "Contact", icon: "ri-mail-line", adminOnly: false },
  { id: "users", label: "Users", icon: "ri-team-line", adminOnly: true },
];

export default function Sidebar({
  isOpen,
  onClose,
  activePage,
  onPageChange,
}: SidebarProps) {
  const isAdmin = localStorage.getItem("adminRole") === "admin";
  const visiblePages = pages.filter((page) => !page.adminOnly || isAdmin);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-background-200 z-50 transition-transform duration-300 w-64 overflow-y-auto sidebar-scroll ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 bg-secondary-900 border-b border-secondary-800 flex flex-col items-center justify-center px-6 flex-shrink-0">
            <img
              src="https://kavispharma.com/wp-content/uploads/2024/06/logo.png"
              alt="Kavis Pharma"
              className="h-9 w-auto object-contain"
            />
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {visiblePages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => {
                    onPageChange(page.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activePage === page.id
                      ? "bg-primary-500 text-white"
                      : "text-foreground-700 hover:bg-primary-50 hover:text-primary-600"
                  }`}
                >
                  <i className={`${page.icon} text-lg`}></i>
                  <span className="text-sm font-medium">{page.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
