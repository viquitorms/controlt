import { TextField, Stack, MenuItem } from "@mui/material";
import { useState } from "react";
import Dialog from "../../components/Dialog.component";
import type { Profile } from "../../dtos/Profile.entity";
import type { UserCreateRequest } from "../../dtos/user/User.req.dto";

interface ICreateUserModal {
	open: boolean;
	onClose: () => void;
	onSave: (user: UserCreateRequest) => void;
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

	const handleSave = () => {
		if (!isValid()) return;

		const userData: UserCreateRequest = {
			name: name,
			email: email,
			password: password,
			profile_id: profileId,
		};

		onSave(userData);
		onClose();
	};

	return (
		<Dialog
			open={open}
			title={'Adicionar Usuário'}
			onClose={onClose}
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
		</Dialog>
	);
}