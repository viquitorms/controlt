import { useState } from 'react';

interface IUseBackdrop {
    open: boolean;
    showBackdrop: () => void;
    hideBackdrop: () => void;
}

export function useBackdrop(): IUseBackdrop {
    const [open, setOpen] = useState(false);

    const showBackdrop = () => setOpen(true);
    const hideBackdrop = () => setOpen(false);

    return { open, showBackdrop, hideBackdrop };
}