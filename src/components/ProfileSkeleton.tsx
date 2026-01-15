// src/components/ProfileSkeleton.tsx
export default function ProfileSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 py-6 animate-pulse">
      {/*Avatar Section*/}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="h-24 w-24 rounded-full bg-slate-200" />
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </div>

      {/*Divider*/}
      <div className="h-px bg-slate-200 my-6" />

      {/* Update Profile */}
      <div className="space-y-4 mb-6">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded-md" />
        <div className="h-10 w-full bg-slate-200 rounded-md" />
      </div>

      {/*Divider*/}
      <div className="h-px bg-slate-200 my-6" />

      {/*Change Password*/}
      <div className="space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded-md" />
        <div className="h-10 w-full bg-slate-200 rounded-md" />
        <div className="h-10 w-full bg-slate-200 rounded-md" />
        <div className="h-10 w-full bg-slate-300 rounded-md" />
      </div>
    </div>
  );
}
