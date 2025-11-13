import { TextField, Stack, Select, InputLabel, FormControl, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import CTDialog from "../../components/ui/organisms/dialog/CTDialog.component";
import type { Project } from "../../dtos/project/Project.res.dto";
import { useInitialize } from "../../contexts/Initialized.context";

interface IUpdateProjectModal {
	open: boolean;
	project: Project | null;
	onClose: () => void;
	onSave: (project: Project) => Promise<boolean>;
}

export default function UpdateProjectModal({ open, project, onClose, onSave }: IUpdateProjectModal) {
	const { statusProjects } = useInitialize();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState(0);

	useEffect(() => {
		if (open && project) {
			setTitle(project.title || '');
			setDescription(project.description || '');
			setStatus(project.status_id);
		}
	}, [open, project]);

	const clear = () => {
		setTitle('');
		setDescription('');
		setStatus(0);
	};

	const isValid = () => {
		return title.trim() !== '' &&
			description.trim() !== ''
	};

	const handleClose = async () => {
		clear();
		onClose();
	};

	const handleSave = async () => {
		if (!isValid()) return;

		if (!project) return;

		const updatedProject: Project = {
			...project,
			title: title.trim(),
			description: description.trim(),
			status_id: status,
		};

		const success = await onSave(updatedProject);

		if (success) {
			onClose();
			clear();
		}
	};

	return (
		<CTDialog
			open={open}
			title={'Editar Projeto'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={'Atualizar'}
			confirmDisabled={!isValid()}
		>
			<Stack spacing={2} sx={{ mt: 1 }}>
				<TextField
					label="Título do Projeto"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					fullWidth
					required
				/>
				<TextField
					label="Descrição"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					fullWidth
					required
				/>
				<FormControl fullWidth>
					<InputLabel>Status</InputLabel>
					<Select
						value={status}
						label="Status"
						onChange={(e) => setStatus(e.target.value)}
					>
						{
							statusProjects.map((s) => (
								<MenuItem key={s.id} value={s.id}>
									{s.name}
								</MenuItem>
							))
						}
					</Select>
				</FormControl>
			</Stack>
		</CTDialog>
	);
}