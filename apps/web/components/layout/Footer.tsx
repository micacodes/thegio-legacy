import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white border-t-4 border-brand-orange">
      {/* --- CHANGE 1: Reduced vertical padding from py-10 to py-8 --- */}
      <div className="container mx-auto px-6 py-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 md:col-span-2">
            <Link href="/" legacyBehavior>
              <a className="text-2xl font-bold hover:text-gray-300 transition-colors">
                Thegio
              </a>
            </Link>
            <p className="mt-3 text-sm text-gray-400 max-w-xs">
              Preserving life stories and creating lasting legacies for families around the world.
            </p>
            <div className="flex space-x-5 mt-5">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FaFacebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><FaInstagram size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider uppercase text-gray-200">Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">DIY Design</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Premium Service</Link></li>
              <li><Link href="/templates" className="text-gray-400 hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Printing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold tracking-wider uppercase text-gray-200">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider uppercase text-gray-200">Company</h3>
            {/* --- CHANGE 2: Reduced space between links --- */}
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* --- CHANGE 3: Reduced top margin and padding for the copyright section --- */}
        <div className="mt-8 border-t border-gray-700 pt-5 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Thegio. All rights reserved. Made with ❤️ for families everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;