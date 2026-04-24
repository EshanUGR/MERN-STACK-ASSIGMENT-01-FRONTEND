import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-cyan-200/20 bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(6,182,212,0.24),transparent_48%),radial-gradient(circle_at_88%_78%,rgba(16,185,129,0.20),transparent_44%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 font-black">
                A
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-wide">
                  Akila Suppliers
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/90">
                  Safety Item Supplier
                </p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-300">
              Reliable safety products for workplaces, industrial teams, and
              field operations. Built for faster procurement and trusted
              delivery.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-2">
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                Quick Links
              </h3>
              <div className="space-y-2 text-sm">
                <Link
                  to="/"
                  className="block text-slate-300 hover:text-cyan-200"
                >
                  Home
                </Link>
                <Link
                  to="/items"
                  className="block text-slate-300 hover:text-cyan-200"
                >
                  Safety Items
                </Link>
                <Link
                  to="/customers"
                  className="block text-slate-300 hover:text-cyan-200"
                >
                  Customers
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                Operations
              </h3>
              <div className="space-y-2 text-sm">
                <Link
                  to="/orders"
                  className="block text-slate-300 hover:text-cyan-200"
                >
                  Orders
                </Link>
                <Link
                  to="/order-status"
                  className="block text-slate-300 hover:text-cyan-200"
                >
                  Purchases
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-slate-300 hover:text-cyan-200"
                >
                  Insights
                </Link>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                Support
              </h3>
              <p className="text-sm text-slate-300">
                Mon - Sat | 8:30 AM - 6:00 PM
              </p>
              <a
                href="mailto:support@akilasuppliers.com"
                className="mt-2 block text-sm text-cyan-200 hover:text-cyan-100"
              >
                support@akilasuppliers.com
              </a>
              <p className="mt-1 text-sm text-slate-300">+94 77 123 4567</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} Akila Suppliers. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-cyan-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-cyan-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-cyan-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
