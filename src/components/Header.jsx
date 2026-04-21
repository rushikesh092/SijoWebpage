import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition hover:text-brushedGoldSoft ${isActive ? "text-brushedGold" : "text-white/80"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slateGrey/55 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="max-w-[11.5rem] truncate text-xs font-semibold uppercase tracking-[0.12em] text-brushedGold sm:max-w-none sm:text-sm md:text-base"
        >
          Sijo Plastics Pvt. Ltd.
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/category/faucets" className={navLinkClass}>
            Faucets
          </NavLink>
          <NavLink to="/category/sinks" className={navLinkClass}>
            Sinks
          </NavLink>
          <NavLink to="/category/bathroom-ware" className={navLinkClass}>
            Bathroom Ware
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-1 rounded-sm border border-brushedGold/30 bg-brushedGold/10 px-2.5 py-2 text-xs font-medium text-brushedGold transition hover:bg-brushedGold/20 md:hidden"
          >
            <ShoppingCart size={14} />
            Cart
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brushedGold px-1 text-[10px] font-semibold text-obsidian">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <Link
            to="/cart"
            className="relative hidden items-center gap-2 rounded-sm bg-brushedGold px-4 py-2 text-sm font-medium text-obsidian transition hover:bg-brushedGoldSoft md:inline-flex"
          >
            <ShoppingCart size={16} />
            Cart
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-obsidian px-1 text-xs font-semibold text-brushedGold">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex rounded-sm border border-white/30 p-2 text-white md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen ? (
        <div className="border-t border-white/10 bg-[#0f1216] px-4 py-3 md:hidden">
          <nav className="grid gap-2 text-sm text-white/90">
            <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink
              to="/category/faucets"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Faucets
            </NavLink>
            <NavLink
              to="/category/sinks"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sinks
            </NavLink>
            <NavLink
              to="/category/bathroom-ware"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Bathroom Ware
            </NavLink>
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Admin
            </NavLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
