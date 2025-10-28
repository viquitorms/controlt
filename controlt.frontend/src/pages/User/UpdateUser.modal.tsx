import { TextField, Stack, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import Dialog from "../../components/ui/Dialog.component";
import type { Profile } from "../../dtos/Profile.entity";
import type { UserFindByIdResponse } from "../../dtos/user/User.res.dto";
import type { UserUpdateRequest } from "../../dtos/user/User.req.dto";

interface IUpdateUserModal {
	open: boolean;
	user: UserFindByIdResponse | null;
	onClose: () => void;
	onSave: (user: UserUpdateRequest) => Promise<boolean>;
	profiles?: Profile[];
}

export default function UpdateUserModal({ open, user, onClose, onSave, profiles }: IUpdateUserModal) {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [profileId, setProfileId] = useState<number>(2);

	useEffect(() => {
		if (open && user) {
			setName(user.name || '');
			setEmail(user.email || '');
			setProfileId(user.profile?.id ?? 2);
		}
	}, [open, user]);

	const clear = () => {
		setName('');
		setEmail('');
		setProfileId(2);
	};

	const isValid = () => {
		return name.trim() !== '' &&
			email.trim() !== '' &&
			profileId !== 0;
	};

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		if (!user) return;

		const userData: UserUpdateRequest = {
			id: user.id,
			name: name,
			email: email,
			profile_id: profileId,
		};

		const success = await onSave(userData);

		if (success) {
			onClose();
			clear();
		}
	};

	return (
		<Dialog
			open={open}
			title={user ? 'Editar Usuário' : 'Adicionar Usuário'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={user ? 'Atualizar' : 'Salvar'}
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
					label="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
					required
				/>
				<TextField
					select
					label="Perfil"
					value={profileId}
					onChange={(e) => setProfileId(Number(e.target.value))}
					fullWidth
					required
				>
					{profiles?.map((profile) => (
						<MenuItem key={profile.id} value={profile.id}>
							{profile.name}
						</MenuItem>
					))}
				</TextField>
			</Stack>
		</Dialog>
	);
}