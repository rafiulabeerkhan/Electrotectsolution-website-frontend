import { create } from "zustand";

export const usePaginationStore = create((set) => ({
  page: 1,
  limit: 10,
  totalData: 0,
  search: "",
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setTotalData: (totalData) => set({ totalData }),
  setSearch: (search) => set({ search }),
}));
