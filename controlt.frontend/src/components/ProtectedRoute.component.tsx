import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface IProtectedRoute {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: IProtectedRoute) {

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}