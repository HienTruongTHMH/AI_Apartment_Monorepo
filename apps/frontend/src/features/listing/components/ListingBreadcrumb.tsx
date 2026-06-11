interface ListingBreadcrumbProps {
  crumbs: string[];
}

export function ListingBreadcrumb({ crumbs }: ListingBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 flex-wrap mb-5" style={{ fontSize: "0.78rem" }}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className={i === crumbs.length - 1 ? "text-white/80 font-medium" : "text-white/35"}>
            {crumb}
          </span>
          {i < crumbs.length - 1 && <span className="text-white/20">/</span>}
        </span>
      ))}
    </nav>
  );
}
