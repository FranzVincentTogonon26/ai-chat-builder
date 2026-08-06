"use client";

import { isAuthrized } from "@/lib/isAuthorized";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await isAuthrized();
      setEmail(user.email);
      setLoading(false);
    };
    fetchUser();
  }, []);

  return { email, loading };
};
