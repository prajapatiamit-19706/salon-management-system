import { AppRouter } from "./router/appRouter"
import "./app.css";
import "./admin/admin.css";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  );
};