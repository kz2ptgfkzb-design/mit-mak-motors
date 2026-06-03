export function VehicleSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-10 flex-1 rounded-full" />
          <div className="skeleton h-10 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
