import React from "react";
import Link from "next/link";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="tracking-wide bg-gray-800 py-10 px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        <div>
          <h4 className="text-white text-lg font-semibold mb-6">Company</h4>
          <ul className="space-y-5">
            <li>
              <Link href="/about" className="text-gray-300 hover:text-white text-[15px]">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-300 hover:text-white text-[15px]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-semibold mb-6">Information</h4>
          <ul className="space-y-5">
            <li>
              <Link href="#" className="text-gray-300 hover:text-white text-[15px]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-300 hover:text-white text-[15px]">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-semibold mb-6">Help</h4>
          <ul className="space-y-5">
            <li>
              <Link href="#" className="text-gray-300 hover:text-white text-[15px]">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-300 hover:text-white text-[15px]">
                Shipping Information
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-300 hover:text-white text-[15px]">
                Returns & Exchanges
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-semibold mb-6">Contact Us</h4>
          <ul className="space-y-5 text-gray-300">
            <li className="text-[15px] cursor-pointer break-words">
              <span className="font-semibold">Email:</span> nilamburinteriors.sales@gmail.com
            </li>
            <li className="text-[15px] cursor-pointer break-words">
              <span className="font-semibold">Phone:</span> +91 9961038000
            </li>
            <li className="text-[15px] break-words">
              <span className="font-semibold">Location:</span>
              <Link
                href="https://maps.app.goo.gl/wkiwAPMoueoCXWR57"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                Valikode, near Reliance Petrol Pump, Nedumangad, Kerala 695541
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-gray-300 text-center text-[15px] mt-8">
        &copy; {year} <span className="font-bold">Upsite Development.</span> All Rights Reserved
      </p>
    </footer>
  );
}

export default Footer;
