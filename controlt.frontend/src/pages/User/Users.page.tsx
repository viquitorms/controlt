import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import DataGrid from "../../components/DataGrid.component";
import { PersonAdd } from "@mui/icons-material";
import AddUserModal from "./AddUser.modal";

export default function Users() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <Stack spacing={2}>
            <Typography variant={'h5'}>Usuários</Typography>

            <Stack direction={'row'} justifyContent={'space-between'}>
                <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => setOpenModal(true)}
                >
                    Adicionar
                </Button>
            </Stack>

            <DataGrid />

            <AddUserModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            />
        </Stack>
    );
}