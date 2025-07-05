'use client'

import React from 'react';
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer relative z-[10]" style={{ zIndex: 10, position: 'relative' }}>
      <div className="max-w-5xl mx-auto">
        <div className="footer-grid grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#hero-section" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#deals-section" className="footer-link">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-link">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="footer-link">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-right col-span-2 md:col-span-1">
            <h4 className="font-bold text-white mb-4">Join the Community</h4>
            <div className="flex justify-center md:justify-end space-x-6 text-2xl">
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-discord"></i>
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-8">
              &copy; 2025 Creator&apos;s Deal Hub. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
