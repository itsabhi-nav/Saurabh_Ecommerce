"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Saurabh Trading
          </h3>
          <p className="text-sm mb-4">
            We offer high-quality electronics, gadgets, and appliances at
            competitive prices. Shop with confidence at Saurabh Trading.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="https://www.saurabhtrading.in/"
                className="hover:underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="https://www.saurabhtrading.in/about"
                className="hover:underline"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="https://www.saurabhtrading.in/service"
                className="hover:underline"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="https://www.shopping.saurabhtrading.in/"
                className="hover:underline"
              >
                Shop Now
              </Link>
            </li>
            <li>
              <Link
                href="https://www.saurabhtrading.in/contact"
                className="hover:underline"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
          <p className="text-sm mb-2">
            <i className="fa fa-map-marker-alt mr-2"></i>
            28/A Shivpuri Colony, Japla, Jharkhand
          </p>
          <p className="text-sm mb-2">
            <i className="fa fa-phone-alt mr-2"></i>+91 7632905199
          </p>
          <p className="text-sm mb-2">
            <i className="fa fa-phone-alt mr-2"></i>+91 9234360028
          </p>
          <p className="text-sm">
            <i className="fa fa-envelope mr-2"></i>saurabhtrading0028@gmail.com
          </p>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Newsletter</h4>
          <p className="text-sm mb-4">
            Subscribe to get the latest updates and offers.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 rounded-l border-none focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Saurabh Trading. All Rights
            Reserved. Designed by{" "}
            <Link
              href="https://itsabhinav.tech"
              className="hover:underline text-blue-400"
            >
              Abhinav Dubey
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
