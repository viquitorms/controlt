import { TextField, Stack } from "@mui/material";
import { useState } from "react";
import Dialog from "../../components/Dialog.component";
import type { TeamCreateRequest } from "../../dtos/team/Team.req.dto";

interface ICreateTeamModal {
	open: boolean;
	onClose: () => void;
	onSave: (team: TeamCreateRequest) => Promise<boolean>;
}

export default function CreateTeamModal({ open, onClose, onSave }: ICreateTeamModal) {

	const [name, setName] = useState('');

	const isValid = () => {
		return name.trim() !== ''
	};

	const clear = () => {
		setName('');
	}

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		const teamData: TeamCreateRequest = {
			name: name,
		};

		const success = await onSave(teamData);

		if (success) {
			clear();
			onClose();
		}
	};

	return (
		<Dialog
			open={open}
			title={'Adicionar Equipe'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={'Criar Equipe'}
			confirmDisabled={!isValid()}
		>
			<Stack spacing={2} sx={{ mt: 1 }}>
				<TextField
					label="Nome da Equipe"
					value={name}
					onChange={(e) => setName(e.target.value)}
					fullWidth
					required
				/>
			</Stack>
		</Dialog>
	);
}