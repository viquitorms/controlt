import { Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import ProcessItem from "./processModal/ProcessItem.modal";
import { useInboxController } from "./Inbox.controller";

export default function Inbox() {
    const navigate = useNavigate();
    const {
        itemsList,
        columns,
        modalOpen,
        selectedItem,
        usersList,
        projectsList,
        handleOpenWizard,
        handleCloseWizard,
        handleProcessItem,
        handleConvertToProject,
        handleRefresh,
        statusTasks,
        priorities,
        statusProjects,
    } = useInboxController();

    function CustomNoRowsOverlay() {
        return (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
                <Typography>Nenhum item para exibir.</Typography>
                <Button variant="contained" onClick={() => navigate("/captura")}>
                    Capturar Itens
                </Button>
            </Stack>
        );
    }

    return (
        <Stack spacing={2}>
            <CTDataGrid
                rows={itemsList || []}
                columns={columns}
                NoRowsOverlay={CustomNoRowsOverlay}
                refresh={handleRefresh}
                cursor="pointer"
                onRowDoubleClick={handleOpenWizard}
            />

            <ProcessItem
                open={modalOpen}
                item={selectedItem}
                onClose={handleCloseWizard}
                onProcess={handleProcessItem}
                onConvertToProject={handleConvertToProject}
                users={usersList}
                priorities={priorities}
                statusTasks={statusTasks}
                statusProjects={statusProjects}
                projects={projectsList}
            />
        </Stack>
    );
}