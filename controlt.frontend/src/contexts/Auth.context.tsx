import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { AuthUser } from '../models/Auth.model';
import { useSnackbar } from './Snackbar.context';
import { ProfileEnum } from '../enums/Profile.enum';

interface IAuthContext {
    user: AuthUser | null;
    isLoading: boolean;
    isManager: boolean;
    setUser: (user: AuthUser | null) => void;
    clearUser: () => void;
    refreshUser: () => Promise<void>;
}

interface IAuthProvider {
    children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: IAuthProvider) {
    const { showSnackbar } = useSnackbar();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isManager, setIsManager] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user) {
            setIsManager(user.profile.id === ProfileEnum.GERENTE);
        } else {
            setIsManager(false);
        }
    }, [user]);

    async function loadUser() {
        try {
            const user = await authService.getCurrentUser();
            if (user) {
                setUser(user);
            }
        } catch (error) {
            showSnackbar('Erro ao carregar usuário');
            authService.logout();
        } finally {
            setIsLoading(false);
        }
    }

    async function refreshUser() {
        await loadUser();
    }

    async function clearUser() {
        setUser(null);
        setIsManager(false);
        await authService.logout();
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isManager,
                setUser,
                clearUser,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): IAuthContext {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
}