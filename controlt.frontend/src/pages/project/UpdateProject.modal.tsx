import { TextField, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import Dialog from "../../components/ui/Dialog.component";
import type { ProjectFindByIdResponse } from "../../dtos/project/Project.res.dto";
import type { ProjectUpdateRequest } from "../../dtos/project/Project.req.dto";

interface IUpdateProjectModal {
	open: boolean;
	project: ProjectFindByIdResponse | null;
	onClose: () => void;
	onSave: (project: ProjectUpdateRequest) => Promise<boolean>;
}

export default function UpdateProjectModal({ open, project, onClose, onSave }: IUpdateProjectModal) {

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState('');

	useEffect(() => {
		if (open && project) {
			setTitle(project.title || '');
			setDescription(project.description || '');
			setStatus(project.status);
		}
	}, [open, project]);

	const clear = () => {
		setTitle('');
		setDescription('');
		setStatus('');
	};

	const isValid = () => {
		return title.trim() !== '' &&
			description.trim() !== '' &&
			status.trim() !== ''
	};

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		if (!project) return;

		const projectData: ProjectUpdateRequest = {
			id: project.id,
			title: title,
			description: description,
			status: status,
		};

		const success = await onSave(projectData);

		if (success) {
			onClose();
			clear();
		}
	};

	return (
		<Dialog
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
				<TextField
					label="Status"
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					fullWidth
					required
				/>
			</Stack>
		</Dialog>
	);
}