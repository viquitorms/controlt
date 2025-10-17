import { TextField, Stack } from "@mui/material";
import { useState } from "react";
import Dialog from "../../components/Dialog.component";
import type { ProjectCreateRequest } from "../../dtos/project/Project.req.dto";

interface ICreateProjectModal {
	open: boolean;
	onClose: () => void;
	onSave: (project: ProjectCreateRequest) => Promise<boolean>;
}

export default function CreateProjectModal({ open, onClose, onSave }: ICreateProjectModal) {

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState('');

	const isValid = () => {
		return title.trim() !== '' &&
			description.trim() !== '' &&
			status.trim() !== ''
	};

	const clear = () => {
		setTitle('');
		setDescription('');
		setStatus('');
	}

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		const projectData: ProjectCreateRequest = {
			title: title,
			description: description,
			status: status,
		};

		const success = await onSave(projectData);

		if (success) {
			clear();
			onClose();
		}
	};

	return (
		<Dialog
			open={open}
			title={'Adicionar Projeto'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={'Criar Projeto'}
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
					label="Status do projeto"
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					fullWidth
					required
				/>
			</Stack>
		</Dialog>
	);
}