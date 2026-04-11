import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Overview } from "./OverView"
import { DashboardAppointments } from "./DashboardAppointments";
import { ProfileEditor } from "./ProfileEditor";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDashboard } from "../../API/dashboard.api";
import { LoadingSpinner } from "../LoadingSpinner";

export const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const token = localStorage.getItem("token");
  
    const {
      data,
      isPending,
      isError
    } = useQuery({
        queryKey : ["userDashboard"],
        queryFn: () => fetchUserDashboard(token)
    });
 
    console.log("Dashboard API Data:", data);
    if (isPending) return <LoadingSpinner />;

    if (isError) return <p>Failed to load dashboard</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ">
        {activeTab === "overview" && 
        <Overview 
           user={data?.user}
            stats={data?.stats || {}}
            favoriteStaff={data?.favoriteStaff}
            upcomingAppointments={data?.upcomingAppointments || []} />}
        {activeTab === "appointments" && 
          <DashboardAppointments
            upcoming={data.upcomingAppointments}
            completed={data.completedAppointments}
            cancelled={data.cancelledAppointments} />}
        {activeTab === "profile" && 
          <ProfileEditor
            user={data.user} />}
      </div>

    </div>
  );
};