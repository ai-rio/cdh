'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWaitlistModal } from '@/lib/stores/waitlist-modal-store';

export default function WaitlistModal() {
  const { isOpen, closeModal } = useWaitlistModal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowSuccess(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setShowSuccess(false);
      setName('');
      setEmail('');
      closeModal();
    }, 3000);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
      // Reset states when modal closes
      setTimeout(() => {
        setShowSuccess(false);
        setName('');
        setEmail('');
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/90 border-white/10 backdrop-blur-xl">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white text-center">
                Join the Waitlist
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-center">
                Be the first to get access and redefine your business.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Your Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || !email || !name}
                className="w-full bg-lime-400 text-black font-bold text-lg py-3 rounded-lg hover:bg-lime-300 disabled:opacity-50 transition-all duration-300"
              >
                {isSubmitting ? 'Securing Your Spot...' : 'Secure My Spot'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 mb-4">
              <svg
                className="w-full h-full text-lime-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="checkmark-animation"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              Welcome to the Command Center!
            </DialogTitle>
            
            <DialogDescription className="text-gray-400">
              You&apos;re now on the waitlist. We&apos;ll notify you when Creator&apos;s Deal Hub launches.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}