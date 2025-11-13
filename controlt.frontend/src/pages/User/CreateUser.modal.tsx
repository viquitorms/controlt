import { TextField, Stack, MenuItem } from "@mui/material";
import { useState } from "react";
import CTDialog from "../../components/ui/organisms/dialog/CTDialog.component";
import type { Profile } from "../../dtos/Profile.entity";
import type { CreateUserDto } from "../../dtos/user/User.req.dto";

interface ICreateUserModal {
	open: boolean;
	onClose: () => void;
	onSave: (user: CreateUserDto) => Promise<boolean>;
	profiles?: Profile[];
}

export default function CreateUserModal({ open, onClose, onSave, profiles }: ICreateUserModal) {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [profileId, setProfileId] = useState<number>(2);

	const isValid = () => {
		return name.trim() !== '' &&
			email.trim() !== '' &&
			password.trim() !== '' &&
			profileId !== 0;
	};

	const clear = () => {
		setName('');
		setEmail('');
		setPassword('');
		setProfileId(2);
	}

	const handleClose = async () => {
		clear();
		onClose();
	}

	const handleSave = async () => {
		if (!isValid()) return;

		const userData: CreateUserDto = {
			name: name,
			email: email,
			password: password,
			profile_id: profileId,
		};

		const success = await onSave(userData);

		if (success) {
			clear();
			onClose();
		}
	};

	return (
		<CTDialog
			open={open}
			title={'Adicionar Usuário'}
			onClose={handleClose}
			onConfirm={handleSave}
			confirmText={'Criar Usuário'}
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
					label="Senha"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
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
		</CTDialog>
	);
}