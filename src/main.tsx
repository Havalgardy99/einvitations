import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import InvitationPage from "./pages/InvitationPage.tsx";
import GuestPage, { RedirectToGuest } from "./pages/GuestPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import TemplateDemoPage from "./pages/TemplateDemoPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/:templateKey" element={<TemplateDemoPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/i/:slug/guest" element={<GuestPage />} />
        <Route path="/i/:slug/rsvp" element={<RedirectToGuest />} />
        <Route path="/i/:slug/wishes" element={<RedirectToGuest />} />
        <Route path="/i/:slug" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
