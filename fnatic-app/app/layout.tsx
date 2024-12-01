'use client'

import "../styles/globals.css";
import Navbar from "../components/navbar";
import { OktoProvider, BuildType } from 'okto-sdk-react';
import { ReactNode, useState } from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";


// Create an AuthContext to manage auth state across pages
import { createContext, useContext } from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";

export const AuthContext = createContext({
  authToken: null,
  setAuthToken: (token: string | null) => {},
  handleLogout: () => {}
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("setting auth token to null");
    setAuthToken(null);
  };

  return (
<html lang="en">
      <body className="bg-gray-900 text-white">
      <ThirdwebProvider
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        >
        <GoogleOAuthProvider clientId="">
          <OktoProvider 
            apiKey= ""
            buildType={BuildType.SANDBOX}
          >
            <Navbar />
            {children}
          </OktoProvider>
        </GoogleOAuthProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}