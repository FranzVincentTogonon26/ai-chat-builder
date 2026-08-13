"use client";

import React, { useEffect, useState } from "react";
import InitialForm from "@/components/dashboard/initial-from";

const Page = () => {
  const [isMetaDataAvailable, setIsMetaDataAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      const response = await fetch("/api/metadata/fetch");
      const data = await response.json();

      setIsMetaDataAvailable(data.exists);
      setIsLoading(false);
    };

    fetchMetadata();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex w-full items-center justify-center p-4" />
    );
  }
  return (
    <>
      {!isMetaDataAvailable ? (
        <div className="flex-1 flex w-full">
          <div className="w-full flex items-center justify-center p-4 min-h-[]">
            <InitialForm />
          </div>
        </div>
      ) : (
        <div className="flex h-dvh flex-col p-6 md:p-8 space-y-8 max-w-7xl mx-auto ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                An intelligent chatbot designed to understand customer needs and
                provide fast, relevant, and helpful answers.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
