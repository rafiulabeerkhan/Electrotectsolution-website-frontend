import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    FaCircle,
    FaGear
} from "react-icons/fa6";
import { HiOutlineMenu } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import menuConfig from "../config/menuConfig";
import { useAuthStore } from "../store/authStore";
const Sidebar = () => {
  const location = useLocation();
  const { authUser } = useAuthStore();

  const [open, setOpen] = useState(true);
  const [subMenus, setSubMenus] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const role = authUser?.role;
  const mode = authUser?.mode;

  const theme = {
    bg: "bg-sidebar-bg dark:bg-sidebar-bg-dark",
    text: "text-sidebar-text dark:text-sidebar-text",
    hover: "hover:bg-primary-900 dark:hover:bg-primary-800 hover:text-white",
    active: "bg-primary-800 dark:bg-primary-700 text-white font-semibold",
  };
  const toggleSubMenu = (key) => {
    if (!open) setOpen(true);
    setSubMenus((prev) => ({ [key]: !prev[key] }));
  };
  const filteredMenus = menuConfig
    .filter((menu) => {
      const roleMatched = menu.roles.includes(authUser?.role);
      const modeMatched = !menu.modes || menu.modes.includes(authUser?.mode);

      return roleMatched && modeMatched;
    })
    .map((menu) => ({
      ...menu,
      subMenu: menu.subMenu.filter((sub) => {
        const roleMatched = sub.roles.includes(authUser?.role);
        const modeMatched = !sub.modes || sub.modes.includes(authUser?.mode);

        return roleMatched && modeMatched;
      }),
    }));

  const isMenuActive = (menu) =>
    location.pathname === menu.path ||
    menu.subMenu?.some((sub) => sub.path === location.pathname);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 sm:hidden backdrop-blur-md"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`
          relative h-screen overflow-y-auto
          flex flex-col shrink-0 z-50
          scrollbar-hide

          transition-all duration-300 ease-in-out

          ${theme.bg}
          ${theme.text}

          border-r border-black/5 dark:border-white/5
          shadow-lg backdrop-blur-sm

          ${open ? "w-64 p-5 pt-6" : "w-20 p-3 pt-6"}
        `}
      >
        {/* Header */}
        <div className="mb-7 min-h-[48px] flex items-center justify-center">
          {!open ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className={`
    p-2.5
    rounded-xl
    transition
    ${theme.hover}
  `}
              >
                <HiOutlineMenu className="text-xl" />
              </button>

              <div
                className="
    w-10 h-10 rounded-xl
    bg-white/20
    flex items-center justify-center
    text-lg
  "
              >
                T
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full pl-1 pr-0 gap-3">
              <div className="flex items-center flex-1 min-w-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 text-2xl md:text-3xl font-black tracking-wider ${theme.text} cursor-pointer select-none truncate w-full`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <FaGear className="text-3xl shrink-0 text-sidebar-text" />
                  <span>Welcome</span>
                </motion.div>
              </div>

              <button
                onClick={() => setOpen((prev) => !prev)}
                className={`
  p-2.5
  rounded-xl
  shrink-0
  absolute
  left-full
  transition
  ${theme.hover}
`}
              >
                <HiOutlineMenu className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Menus */}
        <ul className="flex flex-col gap-1.5 flex-grow">
          {filteredMenus.map((menu) => {
            const active = isMenuActive(menu);
            const hasSubMenu = menu.subMenu?.length > 0;

            return (
              <li key={menu.key} className="flex flex-col">
                <Link
                  to={hasSubMenu ? "#" : menu.path}
                  onClick={() => hasSubMenu && toggleSubMenu(menu.key)}
                  className={clsx(
                    "group relative flex items-center py-2.5 rounded-xl transition text-sm shadow-md",
                    open ? "justify-between px-3.5" : "justify-center",
                    theme.hover,
                    active && `${theme.active} ${theme.text} shadow-sm`,
                  )}
                >
                  {active && (
                    <span
                      className={`
      absolute left-0
      top-2.5 bottom-2.5
      w-1 rounded-r-full
       bg-current
    `}
                    />
                  )}

                  <div className="flex items-center gap-3.5">
                    {menu.icon && <menu.icon className="text-xl shrink-0" />}

                    {open && <span className="truncate">{menu.title}</span>}
                  </div>
                </Link>

                {hasSubMenu && subMenus[menu.key] && open && (
                  <ul
                    className="
                      ml-5 mt-1 pl-2

                      border-l
                      border-black/10
                      dark:border-white/20

                      flex flex-col gap-1
                    "
                  >
                    {menu.subMenu.map((sub, i) => (
                      <Link to={sub.path} key={i}>
                        <li
                          className={`
                            flex items-center gap-2.5

                            px-3 py-2

                            rounded-lg

                            text-xs

                           ${theme.hover}

                            ${
                              location.pathname === sub.path
                                ? `${theme.active} ${theme.text}`
                                : ""
                            }
                          `}
                        >
                          <FaCircle className="text-[5px]" />

                          <span className="truncate">{sub.title}</span>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;