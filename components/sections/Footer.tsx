import { PROJECT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="container-luxe hairline-t py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-6">
          <p className="font-display text-xl tracking-wide">{PROJECT.name}</p>
          <p className="text-xs text-stone">{PROJECT.address}</p>
          <p className="text-xs text-stone">
            © {new Date().getFullYear()}. Не является публичной офертой
          </p>
        </div>
      </div>
    </footer>
  );
}
