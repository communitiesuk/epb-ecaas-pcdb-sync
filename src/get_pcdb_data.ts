export async function getPcdbData() {
	const user_auth = `${process.env.PCDB_API_USERNAME}:${process.env.PCDB_API_PASSWORD}`;
	const response = await fetch(`${process.env.PCDB_API_URL}?sensitive=true`, {
		headers: {
			Authorization: `Basic ${btoa(user_auth)}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Error fetching data from the PCDB, status: ${response.status}`);
	}

	const data = await response.json();
	return data;
}

export function formatExportFileName(data: any): string {
	const exportDate = data.exportDate.split("T")[0];
	const fileName = `export_v${data.exportVersion}_${exportDate}.json`;
	return fileName;
}
