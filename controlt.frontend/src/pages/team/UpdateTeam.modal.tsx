import { TextField, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import Dialog from "../../components/Dialog.component";
import type { TeamFindByIdResponse } from "../../dtos/team/Team.res.dto";
import type { TeamUpdateRequest } from "../../dtos/team/Team.req.dto";

interface IUpdateTeamModal {
	open: boolean;
	team: TeamFindByIdResponse | null;
	onClose: () => void;
	onSave: (team: TeamUpdateRequest) => Promise<boolean>;
}

export default function UpdateTeamModal({ open, team, onClose, onSave }: IUpdateTeamModal) {

	const [name, setName] = useState('');

	useEffect(() => {
		if (open && team) {
			setName(team.name || '');
		}
	}, [open, team]);

	const clear = () => {
		setName('');
	};

	const isValid = () => {
		return name.trim() !== ''
	};

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		if (!team) return;

		const teamData: TeamUpdateRequest = {
			id: team.id,
			name: name
		};

		const success = await onSave(teamData);

		if (success) {
			onClose();
			clear();
		}
	};

	return (
		<Dialog
			open={open}
			title={'Editar Equipe'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={'Atualizar'}
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