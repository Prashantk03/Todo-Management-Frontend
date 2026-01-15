export default function TodoSkeleton() {
  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm animate-pulse">
      {/*Left*/}
      <div className="space-y-2">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-3 w-24 rounded bg-slate-100" />
      </div>

      {/*Right*/}
      <div className="flex gap-2">
        <div className="h-7 w-16 rounded bg-slate-200" />
        <div className="h-7 w-8 rounded bg-slate-200" />
      </div>
    </li>
  );
}

