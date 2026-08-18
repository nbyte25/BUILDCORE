import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, HardHat } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'manager' | 'customer')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'manager', 'customer'] 
}) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center animate-bounce shadow-xl">
          <HardHat className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-bold text-slate-200">Verifying Security Credentials...</p>
          <p className="text-xs text-slate-500 font-mono">Authenticating session via RBAC</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and remember original destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Insufficient permissions
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Level Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your account role (<span className="font-mono text-amber-400 uppercase">{role}</span>) does not have administrative privileges to access this sector.
          </p>
          <div className="pt-2">
            <a
              href="/account"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors"
            >
              Go to Client Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
