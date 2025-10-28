import React, { useState } from "react";
import {
	Box,
	Button,
	Popover as MuiPopover,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

interface IFilter {
	title: string;
	description: string;
	captured_date: Dayjs | null;
}

interface Props {
	anchorEl: Element | null;
	open: boolean;
	onClose: () => void;
	onApply?: (filters: IFilter) => void;
}

export default function PopoverFilter({
	anchorEl,
	open,
	onClose,
	onApply,
}: Props) {

	const [filters, setFilters] = useState<IFilter>({
		title: "",
		description: "",
		captured_date: null,
	});


	function clearFilters() {
		setFilters({ title: "", description: "", captured_date: null });
	}


	function applyFilters() {
		if (onApply) onApply(filters);
		onClose();
	}

	return (
		<MuiPopover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			transformOrigin={{ vertical: "top", horizontal: "left" }}
		>

			<Box sx={{ p: 2, minWidth: 300 }}>
				<Stack spacing={2}>
					<Typography variant="subtitle1">Filtros</Typography>

					<TextField
						label="Título"
						size="small"
						fullWidth
						value={filters.title}
						onChange={(e) => setFilters({ ...filters, title: e.target.value })}
						placeholder="Buscar por título..."
					/>

					<TextField
						label="Descrição"
						size="small"
						fullWidth
						value={filters.description}
						onChange={(e) =>
							setFilters({ ...filters, description: e.target.value })
						}
						placeholder="Buscar por descrição..."
					/>

					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="Data capturada"
							value={filters.captured_date}
							onChange={(newValue) =>
								setFilters({ ...filters, captured_date: newValue })
							}
						/>
					</LocalizationProvider>

					<Stack direction="row" spacing={1} justifyContent="flex-end">
						<Button onClick={clearFilters} color="inherit">
							Limpar
						</Button>
						<Button onClick={applyFilters} variant="contained">
							Aplicar
						</Button>
					</Stack>
				</Stack>
			</Box>
		</MuiPopover>
	);
}