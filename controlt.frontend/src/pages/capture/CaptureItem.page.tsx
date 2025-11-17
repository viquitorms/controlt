import { useEffect, useState } from "react";
import { type CreateItemDto } from "../../dtos/item/Item.req.dto";
import { Alert, Box, Button, Card, CardContent, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography } from "@mui/material";
import { Add, Archive, Assignment, CalendarToday, Delete, Flag, Group, KeyboardDoubleArrowRight, WatchLater } from "@mui/icons-material";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { itemService } from "../../services/item.service";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useAuth } from "../../contexts/Auth.context";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import type { Item } from "../../dtos/item/Item.res.dto";
import type { GridColDef, GridRenderCellParams, GridValueGetter } from "@mui/x-data-grid";
import type { User } from "../../dtos/user/User.res.dto";
import CTDialog from "../../components/ui/organisms/dialog/CTDialog.component";
import CTStepper from "../../components/ui/organisms/stepper/CTStepper.organism.component";
import { EnumActionableType } from "../../enums/ActionableType.enum";
import { EnumNonActionableType } from "../../enums/NonActionableType.enum";
import { useInitialize } from "../../contexts/Initialized.context";
import type { Project } from "../../dtos/project/Project.res.dto";
import { DatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import { formatDate } from "../../utils/Date.util";

export default function CaptureItem() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { user } = useAuth();
    const [item, setItem] = useState<CreateItemDto>({
        title: '',
        note: '',
        created_by_id: user!.id,
        is_processed: false,
    });

    const { priorities, statusTasks } = useInitialize()

    const [itemsList, setItemsList] = useState<Item[]>([]);
    const [isProcessDialogOpen, setIsProcessItemDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);

    const [step, setStep] = useState<number>(0);
    const steps = ['Definir Ação', 'Classificar Item', 'Revisar e Finalizar'];
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState<boolean>(true);

    const [isActionable, setIsActionable] = useState<boolean | null>(null);
    const [classification, setClassification] = useState<number | null>(null);
    const [priority, setPriority] = useState<number>(1);
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [assignedUser, setAssignedUser] = useState<User | undefined>(undefined);

    const [project, setProject] = useState<Project | undefined>(undefined);

    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    /**
     * Carrega os items na montagem do componente
     */
    useEffect(() => {
        (async () => {
            try {
                await Promise.all([
                    getItems()
                ]);
            } catch {
                return;
            }
        })();
    }, []);

    /**
     * Cria um novo item na caixa de entrada
     */
    async function createItem() {
        try {
            showBackdrop();
            await itemService.create(item);
            showSnackbar('Item criado e inserido na caida de entrada!', 5000, "success")
            await getItems();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar item';
            showSnackbar(message, 5000, 'error');
        }
        finally {
            hideBackdrop();
        }
    }

    /**
     * Busca os items não processados na caixa de entrada
     */
    async function getItems() {
        try {
            showBackdrop();
            const items = await itemService.findAll({ is_processed: false });
            setItemsList(items);
        } catch (error) {
            showSnackbar('Erro ao carregar items', 5000, 'error');
        }
        finally {
            hideBackdrop();
        }
    }

    /**
     * Limpa os campos de criação de item
     * @returns 
     */
    const clearItem = () => {
        try {
            if (!user) {
                return;
            }

            setItem({
                title: '',
                note: '',
                created_by_id: user.id,
                is_processed: false,
            });
        } catch (error) {
            showSnackbar('Falha ao limpar campos!')
        }
    }

    /**
     * Lida com a limpeza dos campos de criação de item
     */
    const handleClearItem = () => {
        clearItem();
    }

    /**
     * Lida com a criação de um novo item na caixa de entrada
     */
    const handleCreateItem = async () => {
        await createItem()
        clearItem()
    }

    /**
     * Lida com a exibição do dialog de processamento de item
     * @param item 
     */
    const handleShowProcessItemDialog = (item: Item) => {
        setSelectedItem(item);
        setIsProcessItemDialogOpen(true);
    }

    /**
     * Fecha o dialog de processamento de item
     */
    const handleCloseProcessItemDialog = () => {
        setIsProcessItemDialogOpen(false);
        setSelectedItem(null);
        setStep(0);
        setIsNextButtonDisabled(true);
        setIsActionable(null);
        setClassification(null);
    }

    /**
     * Evento de mudança de passo do stepper
     * @param newStep 
     * @param previousStep 
     */
    const handleOnStepChange = (newStep: number, previousStep: number) => {
        if (newStep === steps.length - 1) {
            console.log('adsjfkalsdf');
            setIsNextButtonDisabled(true);
            console.log('isnext:', isNextButtonDisabled);
        }
        else if (newStep > previousStep) {
            setIsNextButtonDisabled(true);
        }
        else {
            setIsNextButtonDisabled(false);
        }

        setStep(newStep);
        renderStep();
    }

    /**
     * Renderiza o conteúdo do passo atual do stepper
     * @returns 
     */
    function renderStep() {
        switch (step) {
            case 0:
                return renderStepActionable();
            case 1:
                if (isActionable)
                    return renderStepClassifyActionable();
                return renderStepClassifyNonActionable();
            case 2:
                return renderProcessReview();
            default:
                return null;
        }
    }

    /**
     * Renderiza o primeiro passo do processamento de itens
     * @returns 
     */
    function renderStepActionable() {

        /**
         * Lida com a mudança da opção de ser acionável ou não no stepper 1
         * @param value 
         */
        function handleActionableChange(value: boolean) {
            if (value !== undefined) {
                setIsNextButtonDisabled(false);
            }
            else {
                setIsNextButtonDisabled(true);
            }

            if (value !== isActionable) {
                setIsActionable(value);
                setClassification(null);
            }
        }

        return (
            <Stack spacing={3}>
                <Typography>Esta tarefa requer alguma ação da sua parte?</Typography>
                <FormControl component="fieldset">
                    <RadioGroup
                        value={isActionable}
                        sx={{ gap: 2 }}
                        onChange={(e) => handleActionableChange(Boolean(e.target.value === 'true'))}
                    >
                        <FormControlLabel
                            value={'true'}
                            control={<Radio />}
                            label={
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Sim, é acionável
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Preciso fazer algo relacionado a este item
                                    </Typography>
                                </Box>
                            }
                        />
                        <FormControlLabel
                            value={'false'}
                            control={<Radio />}
                            label={
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Não é acionável
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        É apenas informação, referência ou pode ser descartado
                                    </Typography>
                                </Box>
                            }
                        />
                    </RadioGroup>
                </FormControl>
            </Stack>
        )
    }

    /**
     * Renderiza o primeiro passo do processamento de itens 
     * @returns 
     */
    function renderStepClassifyActionable() {

        if (classification !== null)
            handleClassificationChange(classification!);

        /**
         * Lida com a mudança da classificação no stepper 2
         * @param value 
         */
        function handleClassificationChange(value: number) {
            if (value !== null) {
                setIsNextButtonDisabled(false);
            }
            else {
                setIsNextButtonDisabled(true);
            }
            setClassification(value);
        }

        return (
            <Stack spacing={3}>
                <Typography>
                    Este item requer ação. Como você quer processá-lo?
                </Typography>

                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={classification}
                        onChange={(e) => handleClassificationChange(Number(e.target.value))}
                        sx={{ gap: 2 }}
                    >
                        <FormControlLabel
                            value={EnumActionableType.FazerAgora}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Flag fontSize="small" color="primary" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Fazer agora (menos de 2 minutos)
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Execute imediatamente e marque como concluído
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />

                        <FormControlLabel
                            value={EnumActionableType.Delegar}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Group fontSize="small" color="primary" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Delegar
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Atribuir a outra pessoa e aguardar
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />

                        <FormControlLabel
                            value={EnumActionableType.Agendar}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarToday fontSize="small" color="primary" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Agendar
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Definir data/hora específica
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />

                        <FormControlLabel
                            value={EnumActionableType.Projeto}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Assignment fontSize="small" color="primary" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            É um projeto (mais de 1 ação)
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Converter em projeto com múltiplas tarefas
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />

                        <FormControlLabel
                            value={EnumActionableType.ProximaAcao}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <KeyboardDoubleArrowRight fontSize="small" color="primary" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Próxima ação
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Ação única que farei quando possível
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />
                    </RadioGroup>
                </FormControl>
            </Stack>
        )
    }

    /**
     * Renderiza o primeiro passo do processamento de itens
     * @returns 
     */
    function renderStepClassifyNonActionable() {

        if (classification !== null)
            handleClassificationChange(classification!);

        /**
         * Lida com a mudança da classificação no stepper 2
         * @param value 
         */
        function handleClassificationChange(value: number) {
            if (value !== null) {
                setIsNextButtonDisabled(false);
            }
            else {
                setIsNextButtonDisabled(true);
            }
            setClassification(value);
        }

        return (
            <Stack spacing={3}>
                <Typography>
                    Este item não requer ação. O que fazer com ele?
                </Typography>

                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={classification}
                        onChange={(e) => handleClassificationChange(Number(e.target.value))}
                        sx={{ gap: 2 }}
                    >
                        <FormControlLabel
                            value={EnumNonActionableType.Lixo}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Delete fontSize="small" color="error" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Descartar
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Não é útil, pode ser deletado
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />

                        <FormControlLabel
                            value={EnumNonActionableType.Referencia}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Archive fontSize="small" color="primary" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Material de referência
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Informação útil para consulta futura
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />

                        <FormControlLabel
                            value={EnumNonActionableType.AlgumDia}
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <WatchLater fontSize="small" color="primary" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            Algum dia / Talvez
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Algo que eu possa querer fazer no futuro
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />
                    </RadioGroup>
                </FormControl>
            </Stack>
        )
    }

    /**
     * Renderiza o passo de revisão e finalização do processamento de item
     * @returns 
     */
    function renderProcessReview() {

        function handleOnPriorityChange(value: number) {
            setPriority(value);
        }

        function handleProjectChange(project: Project | undefined) {
            setProject(project);
        }

        function handleDueDateChange(date: Dayjs | null) {
            setDueDate(date);
        }

        function handleUserChange(user: number | undefined) {
            setAssignedUser(users.find(u => u.id === Number(user)));
        }

        function getStatusName() {
            const status = statusTasks.find(s => s.id === classification);
            return status ? status.name : 'Desconhecido';
        }

        return (
            <Stack spacing={2}>
                <Typography variant="h6">Detalhes Adicionais</Typography>

                <FormControl fullWidth>
                    <InputLabel>Prioridade</InputLabel>
                    <Select
                        value={priority}
                        label="Prioridade"
                        onChange={(e) => handleOnPriorityChange(e.target.value as number)}
                    >
                        {
                            priorities.map((p) => (
                                <MenuItem key={p.id} value={p.level}>
                                    {p.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                {
                    classification !== EnumActionableType.Projeto &&
                    (
                        <FormControl fullWidth>
                            <InputLabel>Projeto</InputLabel>
                            <Select
                                value={project}
                                label="Projeto"
                                onChange={(e) => {
                                    const selectedProject = projects?.find(p => p.id === Number(e.target.value));
                                    handleProjectChange(selectedProject);
                                }}
                            >
                                <MenuItem value={undefined}>Nenhum</MenuItem>
                                {projects?.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )
                }

                {
                    classification === EnumActionableType.Agendar && (
                        <DatePicker
                            label="Data/Hora"
                            value={dueDate}
                            onChange={(e) => handleDueDateChange(e || null)}
                        />
                    )}

                {
                    classification === EnumActionableType.Delegar && (
                        <FormControl fullWidth required>
                            <InputLabel>Delegar para</InputLabel>
                            <Select
                                value={assignedUser || undefined}
                                label="Delegar para"
                                onChange={(e) => handleUserChange(Number(e.target.value))}
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography>{user.name}</Typography>
                                            <Chip
                                                label={user.profile?.name || "Sem perfil"}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                <Alert severity="success">
                    <Typography variant="subtitle1" fontWeight="bold">
                        Resumo do Processamento:
                    </Typography>
                    <Typography variant="body2">
                        Status: <strong>{getStatusName()}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Prioridade: <strong>{priorities.find(p => p.level === priority)?.name}</strong>
                    </Typography>
                    {
                        classification !== EnumActionableType.Projeto && project && (
                            <Typography variant="body2">
                                Projeto: <strong>{project.title}</strong>
                            </Typography>
                        )
                    }
                    {
                        classification === EnumActionableType.Agendar && dueDate && (
                            <Typography variant="body2">
                                Data agendada: <strong>{formatDate(dueDate)}</strong>
                            </Typography>
                        )
                    }
                    {
                        classification === EnumActionableType.Delegar && assignedUser && (
                            <Typography variant="body2">
                                Atribuído para: <strong>{assignedUser.name}</strong>
                                {assignedUser.profile && ` (${assignedUser.profile.name})`}
                            </Typography>
                        )
                    }
                </Alert>
            </Stack>
        )
    }

    /**
     * Lida com o processamento final do item
     */
    async function handleProcessItem() {
        console.log('Finalizar processamento do item');
        handleCloseProcessItemDialog();
    }

    /**
     * Exibição do componente
     */
    return (
        <>
            <Stack spacing={2}>

                {/* Header */}
                <Card variant="outlined">
                    <CardContent>
                        <Stack spacing={2}>

                            <TextField
                                label="O que está na sua mente?"
                                variant="outlined"
                                fullWidth
                                required
                                value={item.title}
                                onChange={(e) => setItem({ ...item, title: e.target.value })}
                                placeholder="Digite algo que precisa fazer, lembrar ou organizar..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleCreateItem();
                                    }
                                }}
                            />

                            <TextField
                                label="Notas adicionais (opcional)"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={item.note}
                                onChange={(e) => setItem({ ...item, note: e.target.value })}
                                placeholder="Adicione contexto, detalhes ou observações..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleCreateItem();
                                    }
                                }}
                            />

                            <Box display="flex" gap={1}>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={handleCreateItem}
                                    disabled={!item.title.trim()}
                                >
                                    Capturar
                                </Button>
                                {item.title && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleClearItem}
                                    >
                                        Limpar
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Inbox */}
                <Stack spacing={2}>
                    <Typography variant="subtitle1">Caixa de Entrada</Typography>
                    <CTDataGrid
                        rows={itemsList}
                        onRowDoubleClick={(params) => handleShowProcessItemDialog(params.row)}
                        cursor="pointer"
                        columns={
                            [
                                {
                                    field: "id",
                                    headerName: "ID",
                                    type: "number",
                                    align: "center",
                                    headerAlign: "center",
                                },
                                {
                                    field: "title",
                                    type: "string",
                                    headerName: "Título",
                                    flex: 1
                                },
                                {
                                    field: "note",
                                    type: "string",
                                    headerName: "Descrição",
                                    flex: 1
                                },
                                {
                                    field: "created_by",
                                    headerName: "Criado por",
                                    flex: 1,
                                    renderCell: (params: GridRenderCellParams<Item>) => {
                                        return (
                                            params.row.created_by?.name || ''
                                        );
                                    }
                                },
                                {
                                    field: "created_date",
                                    headerName: "Data de Criação",
                                    type: "string",
                                    flex: 1,
                                    renderCell: (params: GridRenderCellParams<Item>) => {
                                        return (
                                            new Date(params.row.created_date).toLocaleDateString()
                                        );
                                    }
                                }
                            ]
                        }
                        refresh={getItems}
                    />
                </Stack>

                {/* Process Item Dialog */}
                <CTDialog
                    open={isProcessDialogOpen}
                    title={`Processar Item: ${selectedItem?.title}`}
                    showActions={false}
                    onClose={handleCloseProcessItemDialog}
                >
                    <CTStepper
                        steps={steps}
                        renderStepContent={renderStep}
                        finishButtonText="Processar Item"
                        isNextStepDisabled={isNextButtonDisabled}
                        onStepChange={handleOnStepChange}
                        onFinish={handleProcessItem}
                    />
                </CTDialog>

            </Stack >

        </>
    );
}