'use client'

import "../styles/globals.css";
import Navbar from "../components/navbar";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { defineChain } from "thirdweb";
import { ReactNode } from "react";

// Define the custom chain
const customChain = defineChain({ chainId: 84532 });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ThirdwebProvider
          clientId={process.env.THIRDWEB_CLIENT_ID}
          supportedChains={[customChain]}
          activeChain={customChain}
        >
          <Navbar />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
