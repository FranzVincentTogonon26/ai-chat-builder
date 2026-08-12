"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TeamSection from "@/components/dashboard/settings/team-section";

const SettingPage = () => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      const response = await fetch("/api/organization/fetch");
      const data = await response.json();

      setOrganizationData(data.organizations);
    };

    fetchOrganizationData();
  }, []);

  return (
    <div className="flex h-dvh flex-col p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage workspace preferences, security and billing.
          </p>
        </div>
      </div>

      <Card className="border-white/5 bg-[#0A0A0E]">
        <CardHeader>
          <CardTitle className="text-base font-medium text-white">
            Workspace Settings
          </CardTitle>
          <CardDescription>
            General settings for your organizations. ( Read Only )
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-500">Workspace Name</Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                {organizationData?.business_name}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-500">Primary Website</Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                {organizationData?.website_url || "N/A"}
              </div>
            </div>
          </div>

          <div className="grid gap-4  md:grid-cols-2">
            <div className="space-y-2 text-white">
              <Label className="text-zinc-500">Default Language</Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                English
              </div>
            </div>
            <div className="space-y-2 text-white">
              <Label className="text-zinc-500">Timezone</Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                UTC (GMT+0)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamSection />
    </div>
  );
};

export default SettingPage;
