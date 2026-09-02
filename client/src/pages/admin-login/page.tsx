import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await login(formData.email, formData.password);
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("adminEmail", res.user.email);
      localStorage.setItem("adminRole", res.user.role);
      localStorage.setItem("adminUserId", String(res.user.id));
      if (res.user.name) {
        localStorage.setItem("adminName", res.user.name);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-background-50 to-accent-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center justify-center mb-4">
            <img
              src="https://kavispharma.com/wp-content/uploads/2024/06/logo.png"
              alt="Kavis Pharma"
              className="h-16 w-auto"
            />
            <span className="text-xs text-secondary-700 tracking-widest uppercase font-medium mt-2">
              KAVIS PHARMA LLC
            </span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            CMS Admin Login
          </h1>
          <p className="text-foreground-600">
            Enter your credentials to access the content dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-background-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-foreground-800 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-mail-line text-foreground-400 text-lg"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@kavispharma.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground-800 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-foreground-400 text-lg"></i>
                </div>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <i className="ri-error-warning-line text-lg"></i>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-3 px-6 font-semibold text-white transition-all duration-300 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="ri-arrow-right-line text-lg"></i>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mx-auto flex items-center gap-2 text-sm font-medium text-foreground-600 hover:text-primary-500"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back to Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
