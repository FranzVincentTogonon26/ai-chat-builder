"use client";

import React, { useRef, useState } from "react";
import { InitialData, STEPS } from "../../constant/initial-step";

const InitialForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InitialData>({
    businessName: "",
    websiteUrl: "",
    externalLinks: "",
  });

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto min-h-[400px] flex flex-col justify-center">
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default InitialForm;
