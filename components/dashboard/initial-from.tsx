"use client";

import React, { useEffect, useRef, useState } from "react";
import { InitialData, STEPS } from "../../constant";
import { ArrowRight, ChevronLeft, Command, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

const InitialForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InitialData>({
    businessName: "",
    industry: "",
    description: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const stepData = STEPS[currentStep];
  const Icon = stepData.icon;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (STEPS[currentStep].type === "textarea") {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (STEPS[currentStep].type === "textarea") {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = async () => {
    if (isSubmitting) return;

    const currentField = STEPS[currentStep].field;
    const value = formData[currentField];

    if (currentStep < 2 && (!value || value.trim() === "")) return;

    if (currentStep < STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/metadata/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: formData.businessName,
        industry: formData.industry,
        description: formData.description,
      }),
    });

    await response.json();
    setIsSubmitting(false);
    window.location.reload();
  };

  const isStepValid =
    currentStep >= 2 ||
    (formData[stepData.field] && formData[stepData.field].trim() !== "");

  return (
    <div className="w-full max-w-xl mx-auto min-h-100 flex flex-col justify-center">
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="fixed top-6 right-6 md:top-8 md:right-8 text-xs font-medium text-zinc-600 uppercase tracking-widest pointer-events-none fade-in">
        Setup your account
      </div>
      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
          <div className="relative mb-2 animate-bounce">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-lg animate-pulse" />
            <div className="relative w-13 h-13 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white " />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">
            Storing your Organization info.
          </h2>
          <p className="text-zinc-500">Scanning {formData.industry}</p>
        </div>
      ) : (
        <div
          className={cn(
            "transition-all duration-300 ease-in-out transform",
            isAnimating
              ? "opacity-0 translate-y-4 scale-95"
              : "opacity-100 translate-y-0 scale-100",
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-full -ml-2 w-8 h-8"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-400/20 py-2 px-4 rounded-full">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-medium text-white leading-tight">
                {stepData.question}
              </h1>
              <p className="text-lg text-zinc-500 font-light">
                {stepData.description}
              </p>
            </div>

            <div className="relative group">
              {stepData.type === "textarea" ? (
                <Textarea
                  ref={textareaRef}
                  value={formData[stepData.field] as string}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      [stepData.field]: e.target.value,
                    });
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={stepData.placeholder}
                  className="w-full bg-transparent border-0 border-b border-white/10 text-xl md:text-2xl py-4 pr-12 text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none h-auto shadow-none transition-colors"
                  autoFocus
                />
              ) : (
                <Input
                  ref={inputRef}
                  type={stepData.type}
                  value={formData[stepData.field] as string}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      [stepData.field]: e.target.value,
                    });
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={stepData.placeholder}
                  className="w-full bg-transparent border-0 border-b border-white/10 text-lg md:text-2xl py-4 pr-12 text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none h-auto shadow-none transition-colors"
                  autoFocus
                />
              )}

              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-8">
              <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600">
                {stepData.type === "textarea" ? (
                  <>
                    <Command className="w-3 h-3" />
                    <span>+ Enter</span>
                  </>
                ) : (
                  <span>Press Enter to continue </span>
                )}
              </div>

              <Button
                onClick={handleNext}
                disabled={!isStepValid}
                className={cn(
                  "rounded-full px-8 py-6 text-base font-medium transition-all duration-300",
                  !isStepValid
                    ? "bg-zinc-800 text-zinc-500 hover:bg-zinc-800 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10",
                )}
              >
                {currentStep === STEPS.length - 1 ? "Submit" : "Continue"}
                {currentStep === STEPS.length - 1 ? (
                  <Sparkles className="w-4 h-4 ml-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitialForm;
