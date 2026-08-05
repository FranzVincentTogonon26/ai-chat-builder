import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-sm border-b border-white/5 bg-[#050509]/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-black rounded-[1px]"></div>
          </div>
          <span className="text-base font-medium tracking-tight text-white/90">
            Chat Support
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-light text-zinc-400">
          <Link
            href={"#how-it-works"}
            className="hover:text-white transition-all"
          >
            Interration
          </Link>
          <Link href={"#pricing"} className="hover:text-white transition-all">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={"/api/auth"}
            className="text-xs  font-medium text-zinc-400 hover:text-white transition-all"
          >
            Sign In
          </Link>
          <Link
            href={"/api/auth"}
            className="text-xs  font-medium text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-all"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
