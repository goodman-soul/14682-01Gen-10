import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ConfigAlert } from "@/components/ui/ConfigAlert";
import { useSiteStore } from "@/store/useSiteStore";

export const Layout: React.FC = () => {
  const location = useLocation();
  const { currentSiteId, checkSiteConfig } = useSiteStore();
  const [showAlert, setShowAlert] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { issues } = checkSiteConfig(currentSiteId);

  useEffect(() => {
    setShowAlert(true);
  }, [currentSiteId]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname, currentSiteId]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-6">
          {issues.length > 0 && showAlert && (
            <div className="mb-6">
              <ConfigAlert
                issues={issues}
                onDismiss={() => setShowAlert(false)}
              />
            </div>
          )}

          <div
            className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
