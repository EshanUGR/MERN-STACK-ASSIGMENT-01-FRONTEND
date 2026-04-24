import React from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiHeadphones,
  FiLayers,
  FiPackage,
  FiShield,
  FiTruck,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Home = () => {
  const highlights = [
    {
      title: "Certified Quality",
      detail: "Only verified safety-grade inventory",
      icon: <FiShield className="text-cyan-300" size={20} />,
    },
    {
      title: "Fast Dispatch",
      detail: "Same-day order processing for urgent needs",
      icon: <FiTruck className="text-emerald-300" size={20} />,
    },
    {
      title: "Reliable Support",
      detail: "Dedicated team for item and order guidance",
      icon: <FiHeadphones className="text-sky-300" size={20} />,
    },
  ];

  const categories = [
    {
      name: "PPE Essentials",
      description: "Helmets, gloves, goggles, shoes, and visibility gear.",
      icon: <FiShield size={22} className="text-cyan-300" />,
    },
    {
      name: "Industrial Supplies",
      description: "Worksite tools, kits, packaging, and inspection items.",
      icon: <FiLayers size={22} className="text-emerald-300" />,
    },
    {
      name: "Bulk Procurement",
      description: "Predictable pricing and consistent stock for teams.",
      icon: <FiPackage size={22} className="text-blue-300" />,
    },
  ];

  const process = [
    {
      step: "1",
      title: "Register Customer",
      detail: "Create customer records in seconds with complete contact data.",
      icon: <FiUserPlus size={20} />,
    },
    {
      step: "2",
      title: "Select Safety Items",
      detail: "Choose from tracked stock and update quantities without delays.",
      icon: <FiClipboard size={20} />,
    },
    {
      step: "3",
      title: "Process Orders",
      detail:
        "Place, review, and monitor purchase activity from one dashboard.",
      icon: <FiBarChart2 size={20} />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(6,182,212,0.28),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.18),transparent_42%),radial-gradient(circle_at_60%_82%,rgba(56,189,248,0.18),transparent_48%)]" />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              <FiCheckCircle size={14} />
              Trusted Safety Supply Platform
            </p>

            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Akila Suppliers for
              <span className="block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                smarter safety operations
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Modernize how your team handles customers, stock, and purchase
              flow. Track safety items faster, reduce order mistakes, and keep
              every delivery timeline under control.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/items"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-cyan-300"
              >
                Explore Safety Items
                <FiArrowRight size={16} />
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Manage Orders
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Products Managed", value: "1200+" },
                { label: "Business Clients", value: "350+" },
                { label: "Order Accuracy", value: "98.7%" },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl font-extrabold text-white">
                    {metric.value}
                  </p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-300">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-cyan-900/20 backdrop-blur">
            <h2 className="text-lg font-bold text-white">
              What you can do today
            </h2>
            <div className="mt-4 space-y-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                <FiClock size={16} />
                Live Operations Snapshot
              </p>
              <p className="mt-2 text-sm text-slate-200">
                42 new order requests and 18 ready for dispatch today.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Core safety categories
            </h2>
            <Link
              to="/items"
              className="text-sm font-semibold text-cyan-200 hover:text-cyan-100"
            >
              View all items
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-slate-900/80 p-3">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Fast workflow for every order
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Built for teams that need speed and visibility from customer entry
            to delivery tracking.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {process.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    Step {item.step}
                  </span>
                  <span className="text-cyan-300">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-emerald-300/20 bg-gradient-to-r from-cyan-400/20 via-slate-900 to-emerald-400/20 p-7 text-center sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
            Ready To Scale
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Build a safer and faster supply chain
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Bring your sales, stock control, and order operations together in
            one focused platform.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-cyan-300"
            >
              Create Account
            </Link>
            <Link
              to="/customers"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Add First Customer
            </Link>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] text-emerald-100/90">
            <FiUsers size={14} />
            Teams across retail and industry already onboard
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;
