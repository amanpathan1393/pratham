import "../public.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="exp-pub min-h-full">
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 pt-4 pb-12">
        {children}
      </div>
    </div>
  );
}
