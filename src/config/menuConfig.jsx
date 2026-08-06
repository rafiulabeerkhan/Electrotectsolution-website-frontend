import { MdDashboard, MdPeople } from "react-icons/md";
import {
  FaBoxOpen,
  FaFileInvoice,
  FaFileAlt,
  FaTruckLoading,
  FaHandshake,
} from "react-icons/fa";

const menuConfig = [
  {
    key: "Overview",
    title: "Overview",
    path: "/dashboard/overview",
    icon: MdDashboard,
    roles: ["admin", "manager"],
    subMenu: [],
  },
  {
    key: "Product",
    title: "Products",
    path: "/dashboard/product",
    icon: FaBoxOpen,
    roles: ["admin", "manager"],
    subMenu: [],
  },
  {
    key: "Clients",
    title: "Clients",
    path: "/dashboard/clients",
    icon: MdPeople,
    roles: ["admin", "manager"],
    subMenu: [],
  },
  {
    key: "Documents",
    title: "Documents",
    path: "#",
    icon: FaFileInvoice,
    roles: ["admin", "manager"],
    subMenu: [
      {
        key: "Invoices",
        title: "Invoices",
        path: "/dashboard/documents/invoices",
        icon: FaFileAlt,
        roles: ["admin", "manager"],
      },
      {
        key: "Challans",
        title: "Challans",
        path: "/dashboard/documents/challans",
        icon: FaTruckLoading,
        roles: ["admin", "manager"],
      },
      {
        key: "Quotations",
        title: "Quotations",
        path: "/dashboard/documents/proposals",
        icon: FaHandshake,
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    key: "Users",
    title: "Users",
    path: "/dashboard/users",
    icon: MdPeople,
    roles: ["admin"],
    subMenu: [],
  },
];

export default menuConfig;
