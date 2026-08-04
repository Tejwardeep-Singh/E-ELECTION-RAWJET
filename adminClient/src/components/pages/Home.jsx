import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Footer from "../Footer";
import indiaMap from "../../assets/in.svg"
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";


export default function Home() {
  return (
    <div className="bg-white text-[#0F172A] font-sans relative overflow-hidden select-none antialiased">
      
     
      {/* ---------------- HERO ---------------- */}

<section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#F8FBFF] to-white">

  {/* Soft Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_45%)]" />

  <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center justify-center gap-20">

    {/* ---------------- LEFT : INDIA MAP ---------------- */}

    <div className="flex-1 flex justify-center items-center">

      <img
        src={indiaMap}
        alt=""
        aria-hidden="true"
        className="
          w-full
          max-w-2xl
          max-h-[80vh]
          object-contain
          opacity-[0.40]
          pointer-events-none
          select-none
        "
      />

    </div>

    {/* ---------------- RIGHT : CONTENT ---------------- */}

    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

      {/* Small Label */}

      <div className="mb-6 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">

        DIGITAL DEMOCRACY PLATFORM

      </div>

      {/* Official Logo */}

      <img
        src={logo}
        alt="Bharat Ballot"
        className="h-28 lg:h-36 w-auto object-contain"
      />

      {/* Heading */}

      <h2 className="mt-8 text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 max-w-xl">

        India's Secure Digital Election Platform

      </h2>

      {/* Accent Line */}

      <div className="mt-6 h-1 w-24 rounded-full bg-blue-600" />

      {/* Tagline */}

      <p className="mt-8 text-xl leading-8 text-slate-600 max-w-lg">

        Empowering democracy through
        <span className="font-semibold text-blue-600"> secure</span>,
        <span className="font-semibold text-blue-600"> transparent</span>,
        and
        <span className="font-semibold text-blue-600"> digital</span>
        election management.

      </p>

      {/* CTA Buttons */}

      <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-4">

        <Link
          to="/admin"
          className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
        >
          Admin Login
        </Link>

        <Link
          to="/head"
          className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600"
        >
          Head Login
        </Link>

      </div>

      {/* Trust Badge */}

      <div className="mt-12 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">

        <ShieldCheck
          size={18}
          className="text-emerald-600"
        />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">

          VERIFIED SECURE DEMOCRATIC INFRASTRUCTURE

        </span>

      </div>

    </div>

  </div>

</section>
      <Footer />

    </div>
  );
}