import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { LandingPage } from "../pages/landing/LandingPage";
import { LoginPage } from "../pages/login/LoginPage";
import { GardensPage } from "../pages/gardens/GardensPage";
import { GardenPage } from "../pages/garden/GardenPage";
import { CreateGardenPage } from "../pages/create-garden/CreateGardenPage";
import { TracePage } from "../pages/trace/TracePage";
import { TimelinePage } from "../pages/timeline/TimelinePage";
import { MemoryBookPage } from "../pages/memory-book/MemoryBookPage";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { BottomNav } from "../components/layout/BottomNav";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="pb-20">
      {children}
      <BottomNav />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gardens" element={<ProtectedLayout><GardensPage /></ProtectedLayout>} />
          <Route path="/create" element={<ProtectedLayout><CreateGardenPage /></ProtectedLayout>} />
          <Route path="/garden/:gardenId" element={<ProtectedLayout><GardenPage /></ProtectedLayout>} />
          <Route path="/garden/:gardenId/trace" element={<ProtectedLayout><TracePage /></ProtectedLayout>} />
          <Route path="/garden/:gardenId/timeline" element={<ProtectedLayout><TimelinePage /></ProtectedLayout>} />
          <Route path="/garden/:gardenId/memory-book" element={<ProtectedLayout><MemoryBookPage /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
