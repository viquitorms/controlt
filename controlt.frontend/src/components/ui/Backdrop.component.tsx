import { Backdrop as MuiBackdrop, CircularProgress } from '@mui/material';

interface IBackdrop {
    open: boolean;
    onClose?: () => void;
}

export default function Backdrop({ open, onClose }: IBackdrop) {
    return (
        <MuiBackdrop
            sx={() => ({
                color: '#fff',
                zIndex: 9999,
            })}
            open={open}
            onClick={onClose}
        >
            <CircularProgress color="inherit" />
        </MuiBackdrop>
    );
}