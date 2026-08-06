import { ArrowRight } from "lucide-react";
import React from "react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shawdow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
          <span className="text-xs text-zinc-300 tracking-wide font-light">
            Version 1.0.0 available now
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
          Human friendly support, <br />
          <span className="text-zinc-600">powered by AI.</span>
        </h1>

        <p className="text-xl text-zinc-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Instantly resolve customer questions with an assistant that reads your
          docs ans speaks with empathy. No robotics replies, just answers.
        </p>

        <div className="flex  flex-col items-center justify-center ">
          <a
            href="/api/auth"
            className="flex items-center justify-center text-center h-11 px-8 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-all"
          >
            Start now
            <ArrowRight className="w-4 h-4 ml-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
