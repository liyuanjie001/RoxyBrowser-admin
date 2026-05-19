interface PlaceholderProps {
  title: string;
}

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-6h13v6M9 11V5a2 2 0 012-2h9a2 2 0 012 2v6M3 21h6V9H3v12z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500">「{title}」页面建设中</p>
        <p className="mt-1 text-xs text-slate-400">该模块尚未实现，先占位以保留菜单结构</p>
      </div>
    </div>
  );
}
