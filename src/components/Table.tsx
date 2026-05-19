import { useMemo, useState } from 'react';

interface Column<T> {
  key: string;
  title: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortValue?: (row: T) => number | string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
}

type SortOrder = 'asc' | 'desc' | null;

export function Table<T>({ columns, data, rowKey, emptyText = '暂无数据' }: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    const getValue = col.sortValue
      ? col.sortValue
      : (row: T) => (row as Record<string, unknown>)[sortKey] as number | string;
    const arr = [...data];
    arr.sort((a, b) => {
      const av = getValue(a);
      const bv = getValue(b);
      if (av === bv) return 0;
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [data, columns, sortKey, sortOrder]);

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder('desc');
      return;
    }
    if (sortOrder === 'desc') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortKey(null);
      setSortOrder(null);
    } else {
      setSortOrder('desc');
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((col) => {
              const active = col.sortable && sortKey === col.key && sortOrder;
              return (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                    col.sortable ? 'cursor-pointer select-none hover:text-slate-700' : ''
                  } ${col.className ?? ''}`}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.title}
                    {col.sortable && (
                      <span className="flex flex-col text-[8px] leading-none">
                        <span className={active === 'asc' ? 'text-brand-600' : 'text-slate-300'}>▲</span>
                        <span className={active === 'desc' ? 'text-brand-600' : 'text-slate-300'}>▼</span>
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-slate-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr key={rowKey(row)} className="border-b border-slate-50 hover:bg-slate-50/60">
                {columns.map((col) => (
                  <td key={col.key} className={`whitespace-nowrap px-3 py-2.5 text-slate-700 ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
