'use client';

import Image from 'next/image';
import React from 'react';
import { FaWallet } from 'react-icons/fa6';

const Nav = () => {
  const handleConnectWallet = () => {
    alert('Connect Wallet clicked! (Add your Web3 logic here)');
  };

  return (
    <main className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Left Side: Logo + Title */}
        <div className="flex items-center gap-3">
          {/* StellarFlow Logo*/}
          <div className="shrink-0">
            <Image
              src="/sf.png"
              alt="StellarFlow Logo"
              width={48}
              height={48}
              className="rounded-full object-contain"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tighter leading-none">
            Impact Oracle:{' '}
            <span className="text-[#99DC1B]">Africa</span>
          </h1>
        </div>

        {/* Connect Wallet Button*/}
        <button
          onClick={handleConnectWallet}
          className="wallet-btn group flex items-center gap-2.5 sm:gap-3 
                     px-5 sm:px-7 py-3 rounded-2xl font-semibold 
                     text-sm sm:text-base transition-all duration-300 
                     hover:shadow-xl active:scale-95 whitespace-nowrap"
        >
          <FaWallet className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span>Connect <span className='max-md:hidden'>Wallet</span></span>
        
        </button>

      </div>
    </main>
  );
};

export default Nav;