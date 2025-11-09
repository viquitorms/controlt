import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const CTProtectedRoute = () => {

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default CTProtectedRoute;