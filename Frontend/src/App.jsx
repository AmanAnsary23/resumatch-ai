
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyAnalyses from "./pages/MyAnalyses";
import SavedResumes from "./pages/SavedResumes";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <Navbar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/analyses"
          element={
            <DashboardLayout>
              <MyAnalyses />
            </DashboardLayout>
          }
        />

        <Route
          path="/resumes"
          element={
            <DashboardLayout>
              <SavedResumes />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
