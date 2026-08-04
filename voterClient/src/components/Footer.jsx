import { Link } from "react-router-dom";
import rawjetLogo from "../assets/rawjet-logo.png";      // Update path
import bharatLogo from "../assets/logo.png"; // Update path

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">

      {/* Tricolor Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Bharat Ballot Branding */}
        <div className="flex flex-col items-center">

          <img
            src={bharatLogo}
            alt="Bharat Ballot"
            className="h-20 md:h-24 w-auto object-contain"
          />

          <p className="mt-3 text-sm text-slate-500 font-medium text-center">
            Secure • Transparent • Digital Democracy
          </p>

        </div>

        {/* Navigation */}
        <nav className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm font-semibold">

          <Link
            to="/"
            className="text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200"
          >
            Home
          </Link>

          <Link
            to="/voter/login"
            className="text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200"
          >
            Voter Login
          </Link>

          <Link
            to="/privacy-policy"
            className="text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            className="text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200"
          >
            Terms & Conditions
          </Link>

          <Link
            to="/contact"
            className="text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200"
          >
            Contact
          </Link>

        </nav>

        {/* Divider */}
        <div className="w-2/3 mx-auto my-10 border-t border-slate-200" />

        {/* RawJet */}
        <div className="flex flex-col items-center">

          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400 font-semibold">
            Developed &amp; Maintained By
          </span>

          <div className="mt-5 flex items-center gap-4">

            <img
              src={rawjetLogo}
              alt="Team RawJet"
              className="h-14 w-14 object-contain rounded-xl"
            />

            <div>

              <h3 className="text-xl font-bold text-slate-800">
                Team RawJet
              </h3>

              <p className="text-sm text-slate-500">
                Building Digital Solutions
              </p>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}