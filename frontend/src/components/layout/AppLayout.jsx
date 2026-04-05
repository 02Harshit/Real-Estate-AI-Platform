import { Outlet } from "react-router-dom";
import FloatingChatWidget from "../chat/FloatingChatWidget";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="bg-mesh min-h-screen">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-7xl flex-col px-4 pt-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  );
}
