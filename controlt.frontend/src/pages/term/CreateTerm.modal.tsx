import { TextField, Stack } from "@mui/material";
import { useState } from "react";
import CTDialog from "../../components/ui/CTDialog.component";
import type { TermCreateRequest } from "../../dtos/term/Term.req.dto";

interface ICreateTermModal {
	open: boolean;
	onClose: () => void;
	onSave: (term: TermCreateRequest) => Promise<boolean>;
}

export default function CreateTermModal({ open, onClose, onSave }: ICreateTermModal) {

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	const isValid = () => {
		return name.trim() !== '' &&
			description.trim() !== ''
	};

	const clear = () => {
		setName('');
		setDescription('');
	}

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		const termData: TermCreateRequest = {
			name: name,
			description: description,
		};

		const success = await onSave(termData);

		if (success) {
			clear();
			onClose();
		}
	};

	return (
		<CTDialog
			open={open}
			title={'Adicionar Termo'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={'Criar Termo'}
			confirmDisabled={!isValid()}
		>
			<Stack spacing={2} sx={{ mt: 1 }}>
				<TextField
					label="Nome"
					value={name}
					onChange={(e) => setName(e.target.value)}
					fullWidth
					required
				/>
				<TextField
					label="Descrição do termo"
					type="termo"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					fullWidth
					required
				/>
			</Stack>
		</CTDialog>
	);
}