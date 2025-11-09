import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { ReactNode } from "react";

interface IDialog {
    open: boolean;
    title: string;
    onClose: () => void;
    onConfirm?: () => void;
    children: ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmDisabled?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function CTDialog({
    open,
    title,
    onClose,
    onConfirm,
    children,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmDisabled = false,
    maxWidth = 'sm'
}: IDialog) {
    return (
        <MuiDialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{cancelText}</Button>
                {onConfirm && (
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        disabled={confirmDisabled}
                    >
                        {confirmText}
                    </Button>
                )}
            </DialogActions>
        </MuiDialog>
    );
}