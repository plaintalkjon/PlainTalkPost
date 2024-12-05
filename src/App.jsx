// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from "@components/Navbar/Navbar";
import Home from "@pages/Home/Home";
import Settings from "@pages/Settings/Settings";
import Profile from "@pages/Profile/Profile";
import Login from "@pages/Login/Login";
import { AuthProvider, useAuth } from "@contexts/AuthContext";
import ErrorBoundary from "@components/ErrorBoundary";
import NotFound from "@pages/NotFound/NotFound";
import FindSources from "@pages/FindSources/FindSources";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/find-sources" element={<FindSources />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
