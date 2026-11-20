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

  return await response.json();
}
