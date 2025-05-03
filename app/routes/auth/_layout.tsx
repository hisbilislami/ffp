import { Outlet } from "@remix-run/react";
import React from "react";

const AuthenticationLayout = () => {
  return (
    <div className="relative overflow-x-hidden h-screen flex-col lg:items-center lg:justify-center md:grid lg:max-w-none lg:grid-cols-6 lg:px-0">
      <div className="relative lg:col-span-3 h-full flex-col flex">
        <div className="w-full h-full z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticationLayout;
