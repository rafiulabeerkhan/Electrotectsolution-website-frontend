import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaGear, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Login successful!");
        localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
        setAccessToken(data.data.tokens.accessToken);

        const role = data.data.user.role.toLowerCase();
        navigate(`/dashboard/${role}`);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar-bg to-primary-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center gap-3"
        >
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-xl border border-white/20">
            <FaGear className="text-3xl text-sidebar-text" />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-3 text-center text-sm text-primary-200/80"
        >
          Automated Management System
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white dark:bg-sidebar-bg-dark py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-black/5 dark:border-white/10 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sidebar-text via-primary-400 to-sidebar-text"></div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="email"
                  value="Email address"
                  className="text-text dark:text-text-dark font-medium"
                />
              </div>
              <TextInput
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                theme={{
                  field: {
                    input: {
                      colors: {
                        gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                      },
                    },
                  },
                }}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="password"
                  value="Password"
                  className="text-text dark:text-text-dark font-medium"
                />
              </div>
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-lg" />
                  ) : (
                    <FaEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  className="text-primary-600 focus:ring-primary-500"
                />
                <Label
                  htmlFor="remember"
                  className="text-text-light dark:text-text-dark-light text-sm cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-sidebar-text dark:hover:text-primary-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-button-primary hover:bg-button-primary-hover focus:ring-4 focus:ring-primary-300 dark:bg-sidebar-bg dark:hover:bg-primary-900 transition-all font-semibold shadow-md"
            >
              {isLoading ? "Signing in..." : "Sign in to dashboard"}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-sidebar-bg-dark text-text-muted">
                Secure Automated Portal
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
