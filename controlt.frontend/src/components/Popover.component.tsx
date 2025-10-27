import { Box, Button, Popover as MuiPopover, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

interface IPopover {
	title: string,

}

export default function Popover() {
	return (
		<>
			<MuiPopover
				open={openFilter}
				anchorEl={anchorEl}
				onClose={handleCloseFilter}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<Box sx={{ p: 2 }}>
					<Stack spacing={2}>
						<Typography>Filtros</Typography>

						<TextField
							label="Título"
							variant="outlined"
							size="small"
							fullWidth
							value={filters.title}
							onChange={(e) => setFilters({ ...filters, title: e.target.value })}
							placeholder="Buscar por título..."
						/>

						<TextField
							label="Descrição"
							variant="outlined"
							size="small"
							fullWidth
							value={filters.description}
							onChange={(e) => setFilters({ ...filters, description: e.target.value })}
							placeholder="Buscar por descrição..."
						/>

						<DatePicker
							label="Descrição"
							value={filters.captured_date}
							onChange={(e) => setFilters({ ...filters, captured_date: e })}
						/>

						<Stack direction="row" spacing={1} justifyContent="flex-end">
							<Button onClick={clearFilters} color="inherit">
								Limpar
							</Button>
							<Button onClick={handleCloseFilter} variant="contained">
								Aplicar
							</Button>
						</Stack>
					</Stack>
				</Box>
			</MuiPopover>
		</>
	);
}

