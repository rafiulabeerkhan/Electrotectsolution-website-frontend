import { Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import PageLoader from "../components/PageLoader";
import { useAuthStore } from "../store/authStore";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Button } from "flowbite-react";
import Swal from "sweetalert2";


export default function Layout() {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

const handleLogout = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      logout();

      Swal.fire({
        title: "Logged out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        navigate("/login");
      });
    }
  });
};

  return (
    <div className="relative flex w-full h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex flex-col flex-grow overflow-auto relative">
        {/* Top Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-sidebar-bg-dark border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {authUser ? `Welcome  ${authUser.name || ''}` : "Dashboard"}
            </h2>
            {authUser?.role && (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 px-2.5 py-1 rounded-lg border border-primary-200 dark:border-primary-800/50 shadow-sm">
                {authUser.role}!
              </span>
            )}
          </div>
          
          <Button 
            color="failure" 
            size="sm" 
            onClick={handleLogout} 
            className="flex items-center gap-2 font-medium"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </Button>
        </header>

        <div className="flex-grow p-4 md:p-6 overflow-auto">
          <PageLoader>
            <Outlet />
          </PageLoader>
        </div>

        <footer className="flex justify-end text-center p-4 bg-white dark:bg-sidebar-bg-dark border-t border-gray-200 dark:border-gray-800">
          <Footer />
        </footer>
      </main>
    </div>
  );
}