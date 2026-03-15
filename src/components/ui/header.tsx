export default function Header({ title = "Nailify", hasNotification = false }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #950101, #D81B60, #FFCFE9)",
          }}
        >
          {title}
        </h1>
      </div>
    </header>
  );
}
