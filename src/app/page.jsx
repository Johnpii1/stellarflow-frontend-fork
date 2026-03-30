import React from "react";
import Nav from "./components/Nav";
import AdminTabBar from "./components/AdminTabBar";

const page = () => {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <Nav />
      <AdminTabBar />
    </main>
  );
};

export default page;