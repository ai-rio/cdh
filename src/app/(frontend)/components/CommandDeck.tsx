import React from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface CommandDeckProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export function CommandDeck({ isOpen, onClose, onOpenAuthModal }: CommandDeckProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="top" className="command-deck bg-black/80 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8 max-w-7xl mx-auto text-center">
          <Link href="/blog" className="nav-card bg-white/5" onClick={onClose}>
            <h3 className="text-xl font-bold mb-2">Blog</h3>
            <p className="text-gray-300 text-sm">
              Insights and strategies from the forefront of the creator economy.
            </p>
          </Link>
          <Link href="/pricing" className="nav-card bg-white/5" onClick={onClose}>
            <h3 className="text-xl font-bold mb-2">Pricing</h3>
            <p className="text-gray-300 text-sm">
              Simple, transparent plans that scale with your success.
            </p>
          </Link>
          <Link href="/about" className="nav-card bg-white/5" onClick={onClose}>
            <h3 className="text-xl font-bold mb-2">About Us</h3>
            <p className="text-gray-300 text-sm">
              Learn about our mission to empower professional creators.
            </p>
          </Link>
          <button
            id="auth-modal-trigger"
            className="nav-card text-left bg-white/5"
            onClick={() => {
              onOpenAuthModal?.();
              onClose(); // Close command deck when opening auth modal
            }}
          >
            <h3 className="text-xl font-bold mb-2">Login</h3>
            <p className="text-gray-300 text-sm">Access your Creator's Deal Hub account.</p>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}