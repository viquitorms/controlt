import { createContext, useContext, type ReactNode } from 'react';
import CTBackdrop from '../components/ui/atoms/backdrop/CTBackdrop.component';
import { useBackdrop as useBackdropHook } from '../hooks/useBackdrop.hook';

interface BackdropContextType {
    open: boolean;
    showBackdrop: () => void;
    hideBackdrop: () => void;
}

const BackdropContext = createContext<BackdropContextType | undefined>(undefined);

export function BackdropProvider({ children }: { children: ReactNode }) {
    const backdrop = useBackdropHook();

    return (
        <BackdropContext.Provider value={backdrop}>
            {children}
            <CTBackdrop open={backdrop.open} />
        </BackdropContext.Provider>
    );
}

export const useBackdrop = () => {
    const context = useContext(BackdropContext);
    if (!context) {
        throw new Error('useGlobalBackdrop must be used within BackdropProvider');
    }
    return context;
};