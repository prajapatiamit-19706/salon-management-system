import { Outlet, useLocation } from "react-router-dom"
import { Footer } from "../components/footer"
import { Header } from "../components/Navbar"
import PageMotion from "../components/pageMotion";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatInterface } from "../UI/ChatInterface";


function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}


export const MainLayout = () => {

  const location = useLocation();

  return (
    <>
      <ScrollToTopOnNavigate />

      {/* Your header/navbar component */}
      <Header />

      {/* AnimatePresence watches route changes.
          key={location.pathname} ensures AnimatePresence knows when page changed. */}
      {/* <AnimatePresence mode="wait"> */}
      {/* PageMotion will animate enter/exit for each route */}
      <PageMotion key={location.pathname} className="min-h-screen">
        <Outlet />
      </PageMotion>
      {/* </AnimatePresence> */}
      <ChatInterface />
      {/* Your footer component */}
      <Footer />
    </>
  );


}