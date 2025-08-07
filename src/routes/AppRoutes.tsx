import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Layout from "../layouts/Layout";


const Home = React.lazy(() => import("../pages/Home"));
const About = React.lazy(() => import("../pages/About"));
const Contact = React.lazy(() => import("../pages/Contact"));
const Consultants = React.lazy(() => import("../pages/Consultants"));
const ConsultantDetails = React.lazy(() => import("../pages/ConsultantDetails"));
const Login = React.lazy(() => import("@/pages/Login"));
const Signup = React.lazy(() => import("@/pages/Signup"));
const BecomeConsultant = React.lazy(() => import("@/pages/BecomeConsultant"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const RefundPolicy = React.lazy(() => import("../pages/RefundPolicy"));
const TermsConditions = React.lazy(() => import("../pages/TermsConditions"));
const AdminProtectedRoute = React.lazy(() => import("./AdminProtectedRoute"));
const AdminLayout = React.lazy(() => import("../pages/admin/AdminLayout"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading page...</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/consultants" element={<Consultants />} />
          <Route path="/consultant/:id" element={<ConsultantDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/become-consultant" element={<BecomeConsultant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
        </Route>
        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
              {/* <Route path="consultants" element={<ConsultantManagement />} /> */}
              {/* <Route path="users" element={<UserManagement />} /> */}
            </Route>
          </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;