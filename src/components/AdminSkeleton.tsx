export default function AdminSkeleton() {
  return (
    <tr className="animate-pulse">
      {/*Name*/}
      <td className="px-4 py-3">
        <div className="h-4 w-32 rounded bg-slate-200" />
      </td>

      {/*Email*/}
      <td className="px-4 py-3">
        <div className="h-4 w-48 rounded bg-slate-200" />
      </td>

      {/*Role*/}
      <td className="px-4 py-3">
        <div className="h-5 w-20 rounded-full bg-slate-200" />
      </td>

      {/*Actions*/}
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <div className="h-7 w-20 rounded bg-slate-200" />
          <div className="h-7 w-16 rounded bg-slate-200" />
        </div>
      </td>
    </tr>
  );
}
