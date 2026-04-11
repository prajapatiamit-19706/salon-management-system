import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";

export const DataTable = ({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search…",
  pageSize = 8,
  renderActions,
  emptyMessage = "No data found",
  filterTabs,
  activeFilter,
  onFilterChange,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const appts = Array.isArray(data) ? data : (data?.data ?? []);

  // Filter by search (across all string fields)
  const filtered = appts?.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some((col) => {
      const val = col.accessor ? col.accessor(row) : row[col.key];
      return String(val || "").toLowerCase().includes(q);
    });
  });

  const totalPages = Math.ceil(filtered?.length / pageSize);
  const paged = filtered?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-bg-main rounded-2xl border border-border-soft shadow-soft overflow-hidden">
      {/* ── Toolbar ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-border-soft">
        {/* Filter tabs */}
        {filterTabs && (
          <div className="flex items-center gap-1 bg-bg-soft rounded-xl p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  onFilterChange(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200
                  ${activeFilter === tab.value
                    ? "bg-bg-main text-text-heading shadow-sm"
                    : "text-text-body hover:text-text-heading"
                  }
                `}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === tab.value
                    ? "bg-bg-panel text-primary"
                    : "bg-bg-soft text-text-body"
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        {searchable && (
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-soft border border-border-soft text-[12px] text-text-heading
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-soft focus:bg-bg-main
                placeholder:text-text-muted transition-all duration-200"
            />
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-bg-soft/80">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
              {renderActions && (
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft/50">
            {paged?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-5 py-12 text-center text-[13px] text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged?.map((row, i) => (
                <tr
                  key={row._id || i}
                  className="hover:bg-bg-soft/60 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key || col.header}
                      className="px-5 py-3.5 text-[13px] text-text-body whitespace-nowrap"
                    >
                      {col.render ? col.render(row) : col.accessor ? col.accessor(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-5 py-3.5">{renderActions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border-soft">
          <p className="text-[11px] text-text-muted">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filtered?.length)} of {filtered?.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-bg-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-text-body" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <span key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-[11px] text-text-muted px-1">…</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all duration-200
                      ${p === page
                        ? "bg-primary text-text-invert shadow-sm"
                        : "text-text-body hover:bg-bg-soft"
                      }
                    `}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-bg-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-text-body" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
