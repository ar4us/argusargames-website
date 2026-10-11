export function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 rounded bg-border" aria-hidden />
      <span className="text-xs uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="h-px flex-1 rounded bg-border" aria-hidden />
    </div>
  );
}