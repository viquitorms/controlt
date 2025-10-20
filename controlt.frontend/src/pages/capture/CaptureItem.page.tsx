import { useState } from "react";
import { type ItemCreateRequest } from "../../dtos/item/Item.req.dto";
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { itemService } from "../../services/item.service";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useAuth } from "../../contexts/Auth.context";

export default function CaptureItem() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { user } = useAuth();
    const [item, setItem] = useState<ItemCreateRequest>({
        title: '',
        description: '',
        user_id: user!.id,
        userAssigned_id: undefined,
        project_id: 0,
        due_date: undefined,
        status_name: 'Inbox'
    });

    async function createItem() {
        try {
            showBackdrop();
            await itemService.create(item);
            showSnackbar('Item criado e inserido na caida de entrada!', 5000, "success")
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar item';
            showSnackbar(message, 5000, 'error');
        }
        finally {
            hideBackdrop();
        }
    }

    const clearItem = () => {
        try {
            if (!user) {
                return;
            }

            setItem({
                title: '',
                description: '',
                user_id: user.id,
                userAssigned_id: undefined,
                project_id: 0,
                due_date: undefined,
                status_name: 'Inbox'
            })
        } catch (error) {
            showSnackbar('Falha ao limpar campos!')
        }
    }

    const handleClearItem = () => {
        clearItem();
    }

    const handleCreateItem = async () => {
        await createItem()
        clearItem()
    }

    return (
        <>
            <Stack spacing={2}>
                <Typography variant="h5">Capturar Itens</Typography>
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
                                value={item.description}
                                onChange={(e) => setItem({ ...item, description: e.target.value })}
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
            </Stack>

        </>
    );
}