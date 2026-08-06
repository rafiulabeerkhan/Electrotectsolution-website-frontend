import { Pagination } from "flowbite-react";
import { SyncLoader } from "react-spinners";
import { usePaginationStore } from "../store/paginationStore";
import { useAuthStore } from "../store/authStore";
import { sidebarThemes } from "../config/sidebarThemes";
const DataTable = ({
  tableHead,
  tableData,
  columnMapping = {},
  columnAlignment = {},
  actionButtonsConfig = [],
  headerConfig = {
    title: "Table",
    searchPlaceholder: "Search...",
  },
  loading = false,
}) => {
  const { page, limit, totalData, search, setPage, setLimit, setSearch } =
    usePaginationStore();

  const totalPages = Math.max(1, Math.ceil(totalData / limit));
  const startIndex = (page - 1) * limit;
  const getValue = (obj, path) => {
    return path?.split(".").reduce((acc, key) => acc?.[key], obj);
  };
  const { authUser } = useAuthStore();
  const role = authUser?.role;
  const mode = authUser?.mode;

  const themeKey = ["admin", "moderator"].includes(role)
    ? role
    : `${role}-${mode}`;

  const theme = sidebarThemes[themeKey] || sidebarThemes.admin;

  return (
    <div
      className={`
    overflow-hidden
    rounded-2xl
    shadow-lg
    border
    ${theme.tableBorder}
  `}
    >
      <div
        className={`${theme.bg} flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 text-white rounded-t-xl`}
      >
        <div className={` ${theme.bg} flex items-center gap-2`}>
          <span className="text-sm text-white/80">Show</span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 rounded-md text-text"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <span className="text-sm text-white/80">entries</span>
        </div>

        <h2 className="text-lg font-semibold uppercase tracking-wide text-center">
          {headerConfig.title}
        </h2>

        <input
          type="text"
          placeholder={headerConfig.searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full lg:w-80 px-3 py-2 rounded-lg text-text"
        />
      </div>

      <div className="block md:hidden p-3 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <SyncLoader size={10} color="#059669" />
          </div>
        ) : tableData?.length > 0 ? (
          tableData.map((row, index) => (
            <div
              key={row.id || index}
              className="bg-white border border-primary-100 rounded-xl shadow-sm p-4"
            >
              {tableHead.map((col) => {
                if (col === "Action") {
                  return (
                    <div
                      key={col}
                      className="flex justify-end gap-2 mt-4 pt-3 border-t border-primary-100"
                    >
                      {actionButtonsConfig.map(
                        (btn, i) =>
                          btn.show(row) && (
                            <button
                              key={i}
                              onClick={() => btn.onClick(row)}
                              className="text-primary-600 hover:text-primary-800"
                            >
                              {btn.icon}
                            </button>
                          ),
                      )}
                    </div>
                  );
                }

                let value;

                if (col === "SL") {
                  value = startIndex + index + 1;
                } else {
                  const key =
                    columnMapping[col] || col.toLowerCase().replace(/\s+/g, "");

                  // value = row[key] ?? "-";
                  value = getValue(row, key) ?? "-";
                }

                return (
                  <div
                    key={col}
                    className="flex justify-between gap-4 py-2 border-b border-primary-100 last:border-b-0"
                  >
                    <span className="font-medium text-primary-700">{col}</span>

                    <span className="text-right break-words max-w-[60%]">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center py-8">No data found</div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead className={`${theme.bg}  text-white text-sm uppercase`}>
            <tr>
              {tableHead.map((col) => {
                const align =
                  columnAlignment[col] === "right"
                    ? "text-right"
                    : columnAlignment[col] === "center"
                      ? "text-center"
                      : "text-left";

                return (
                  <th key={col} className={`px-4 py-3 font-semibold ${align}`}>
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className={`${theme.tableBody} divide-y divide-primary-100 `}>
            {loading ? (
              <tr>
                <td colSpan={tableHead.length} className="py-10">
                  <div className="flex justify-center items-center w-full">
                    <SyncLoader size={10} color="#059669" />
                  </div>
                </td>
              </tr>
            ) : tableData?.length > 0 ? (
              tableData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`transition ${theme.tableRowHover}`}
                >
                  {tableHead.map((col) => {
                    if (col === "SL") {
                      return (
                        <td key={col} className="px-4 py-2">
                          {startIndex + index + 1}
                        </td>
                      );
                    }

                    if (col === "Action") {
                      return (
                        <td key={col} className="px-4 py-2">
                          <div className="flex gap-2">
                            {actionButtonsConfig.map(
                              (btn, i) =>
                                btn.show(row) && (
                                  <button
                                    key={i}
                                    onClick={() => btn.onClick(row)}
                                    className="text-primary-600 hover:text-primary-800"
                                  >
                                    {btn.icon}
                                  </button>
                                ),
                            )}
                          </div>
                        </td>
                      );
                    }

                    const key =
                      columnMapping[col] ||
                      col.toLowerCase().replace(/\s+/g, "");

                    // const value = row[key];
                    const value = getValue(row, key);
                    const align =
                      columnAlignment[col] === "right"
                        ? "text-right"
                        : columnAlignment[col] === "center"
                          ? "text-center"
                          : "text-left";
                    if (col.toLowerCase() === "status") {
                      const statusColors = {
                        Pending:
                          "bg-amber-50 text-amber-700 border border-amber-200",

                        Approved:
                          "bg-emerald-50 text-emerald-700 border border-emerald-200",

                        Rejected:
                          "bg-rose-50 text-rose-700 border border-rose-200",

                        Closed:
                          "bg-slate-100 text-slate-600 border border-slate-200",

                        Active:
                          "bg-green-50 text-green-700 border border-green-200",

                        InActive:
                          "bg-zinc-100 text-zinc-500 border border-zinc-200",

                        Shortlisted:
                          "bg-sky-50 text-sky-700 border border-sky-200",

                        Demo: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",

                        Assigned:
                          "bg-indigo-50 text-indigo-700 border border-indigo-200",

                        Due: "bg-orange-50 text-orange-700 border border-orange-200",

                        Submitted:
                          "bg-cyan-50 text-cyan-700 border border-cyan-200",

                        Graded:
                          "bg-violet-50 text-violet-700 border border-violet-200",
                      };

                      return (
                        <td key={col} className={`px-4 py-2 ${align}`}>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              statusColors[value] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {value || "-"}
                          </span>
                        </td>
                      );
                    }
                    return (
                      <td key={col} className={`px-4 py-2 text-text ${align}`}>
                        {value ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHead.length} className="py-6 text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-3 text-text">
        <div className="text-sm text-text-light">
          Showing{" "}
          <span className="font-semibold text-text">
            {totalData === 0 ? 0 : startIndex + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-text">
            {Math.min(page * limit, totalData)}
          </span>{" "}
          of <span className="font-semibold text-text">{totalData}</span>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          showIcons
        />
      </div>
    </div>
  );
};

export default DataTable;