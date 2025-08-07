import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a33] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-bold text-lg mb-2 text-white">Blawise</h3>
          <p className="text-gray-400">
            Seamless consultations via text, voice, or video with top-rated experts.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white hover:underline">Home</Link></li>
            <li><Link to="/consultants" className="text-gray-400 hover:text-white hover:underline">Explore Consultants</Link></li>
            <li><Link to="/login" className="text-gray-400 hover:text-white hover:underline">Login / Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2 text-white">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-400 hover:text-white hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white hover:underline">Support</Link></li>
            <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-white hover:underline">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="text-gray-400 hover:text-white hover:underline">Refund & Cancellation Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2 text-white">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram"><i>{/* Add your icon here */}</i></a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Email"><i>{/* Add your icon here */}</i></a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook"><i>{/* Add your icon here */}</i></a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Blawise. All rights reserved.
      </p>
    </footer>
  );
}