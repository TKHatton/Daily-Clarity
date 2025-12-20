import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Insights = lazy(() => import('./pages/Insights'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const QuickReset = lazy(() => import('./pages/QuickReset'));
const History = lazy(() => import('./pages/History'));
const Account = lazy(() => import('./pages/Account'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <motion.div 
      animate={{ 
        rotate: 360,
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
        scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
      }}
      className="w-10 h-10 border-4 border-[#E8956B]/20 border-t-[#E8956B] rounded-full"
    ></motion.div>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[#6B6B6B] font-medium text-sm"
    >
      Breathe in, breathe out...
    </motion.p>
  </div>
);

// Helper for protected routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Helper for auth routes
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageWrapper><Home /></PageWrapper>
        } />
        <Route path="/login" element={
          <AuthRoute><PageWrapper><Login /></PageWrapper></AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute><PageWrapper><Signup /></PageWrapper></AuthRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>
        } />
        <Route path="/insights" element={
          <PrivateRoute><PageWrapper><Insights /></PageWrapper></PrivateRoute>
        } />
        <Route path="/tools/quick-reset" element={
          <PrivateRoute><PageWrapper><QuickReset /></PageWrapper></PrivateRoute>
        } />
        <Route path="/tools/:toolId" element={
          <PrivateRoute><PageWrapper><ToolPage /></PageWrapper></PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute><PageWrapper><History /></PageWrapper></PrivateRoute>
        } />
        <Route path="/account" element={
          <PrivateRoute><PageWrapper><Account /></PageWrapper></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
