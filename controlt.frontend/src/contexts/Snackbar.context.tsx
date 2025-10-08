import { createContext, useContext, useState } from "react";
import Snackbar from "../components/Snackbar.component";

interface ISnackbar {
    showSnackbar: (message: string, duration?: number) => void;
    hideSnackbar: () => void;
}

const SnackbarContext = createContext<ISnackbar | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState(6000);

    const showSnackbar = (msg: string, dur: number = 6000) => {
        setMessage(msg);
        setDuration(dur);
        setOpen(true);
    };

    const hideSnackbar = () => {
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
            {children}
            <Snackbar
                open={open}
                message={message}
                duration={duration}
                onClose={() => setOpen(false)}>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error("useSnackbar must be used within a SnackbarProvider");
    return context;
}