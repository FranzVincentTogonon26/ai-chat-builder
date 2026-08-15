import Script from "next/script";
import React from "react";

const Page = () => {
  return (
    <div>
      <Script
        src="/widget.js"
        data-id="909dd0b9-0b32-42f0-af16-993d23915fe9"
        defer
      ></Script>
    </div>
  );
};

export default Page;
