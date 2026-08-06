import { useRef, useEffect } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { sidebarThemes } from "../config/sidebarThemes";

const CustomModal = ({
  open,
  setOpen,
  header = "",
  children,
  closedBy,
  width = "",
  position = "",
}) => {
  const modalRef = useRef(null);
  const { authUser } = useAuthStore();
  
  const role = authUser?.role;
  const mode = authUser?.mode;

  const themeKey = ["admin", "moderator"].includes(role)
    ? role
    : `${role}-${mode}`;

  const theme = sidebarThemes[themeKey] || sidebarThemes.admin;
  useEffect(() => {
    if (closedBy === "escape" || closedBy === "both") {
      const handleEscapeKey = (e) => {
        if (e.key === "Escape") {
          setOpen(false, "escape");
        }
      };

      document.addEventListener("keydown", handleEscapeKey);

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [closedBy, setOpen]);

  const handleBackdropClick = (e) => {
    if (
      (closedBy === "mouse" || closedBy === "both") &&
      e.target === modalRef.current
    ) {
      setOpen(false, "mouse");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={modalRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <div
            className={`w-full flex justify-center transform transition-transform duration-300 ${position}`}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl  ${width}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${theme.bg} flex items-center justify-between px-6 py-4 rounded-t-xl border-b ${theme.tableBorder}`}>
                <div className="text-lg font-semibold text-white">{header}</div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1 transition-colors hover:bg-white/10"
                >
                  <RiCloseCircleFill
                    size={24}
                    className="text-white hover:text-white/80"
                  />
                </button>
              </div>

              <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;