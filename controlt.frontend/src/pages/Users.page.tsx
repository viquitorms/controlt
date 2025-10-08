import { Button, Stack, Typography } from "@mui/material";
import DataGrid from "../components/DataGrid.component";

export default function Users() {
    return (
        <>
            <Stack spacing={2}>
                <Stack>
                    <Typography variant={'h5'}>Usuários</Typography>
                </Stack>
                <Stack>
                    <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                        <Button variant="contained">Adicionar Usuário</Button>
                    </Stack>
                </Stack>
                <Stack>
                    <DataGrid />
                </Stack>
            </Stack>
        </>
    )
}