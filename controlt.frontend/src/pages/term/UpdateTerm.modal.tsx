import { TextField, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import CTDialog from "../../components/ui/organisms/dialog/CTDialog.component";
import type { Profile } from "../../dtos/Profile.entity";
import type { TermFindByIdResponse } from "../../dtos/term/Term.res.dto";
import type { TermUpdateRequest } from "../../dtos/term/Term.req.dto";

interface IUpdateTermModal {
	open: boolean;
	term: TermFindByIdResponse | null;
	onClose: () => void;
	onSave: (term: TermUpdateRequest) => Promise<boolean>;
	profiles?: Profile[];
}

export default function UpdateTermModal({ open, term, onClose, onSave }: IUpdateTermModal) {

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (open && term) {
			setName(term.name || '');
			setDescription(term.description || '');
		}
	}, [open, term]);

	const clear = () => {
		setName('');
		setDescription('');
	};

	const isValid = () => {
		return name.trim() !== '' &&
			description.trim() !== ''
	};

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		if (!term) return;

		const termData: TermUpdateRequest = {
			id: term.id,
			name: name,
			description: description,
		};

		const success = await onSave(termData);

		if (success) {
			onClose();
			clear();
		}
	};

	return (
		<CTDialog
			open={open}
			title={term ? 'Editar Termo' : 'Adicionar Termo'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={term ? 'Atualizar' : 'Salvar'}
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
					label="Descrição do Termo"
					type="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					fullWidth
					required
				/>
			</Stack>
		</CTDialog>
	);
}