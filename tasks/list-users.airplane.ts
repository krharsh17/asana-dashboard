import airplane from "airplane"
import axios from 'axios'

export default airplane.task(
	{
		slug: "list_users",
		name: "list-users",
		// Set env variables for the task from Airplane's config variables
		envVars: {
			ASANA_PAT: { config: "ASANA_PAT" }
		},
	},
	// This is your task's entrypoint. When your task is executed, this
	// function will be called.
	async () => {
		// Extract the API token from env variables
		const token = process.env.ASANA_PAT ?? "";

		// If the API token is empty, send an empty response to the view
		if (token === "") {
			return [];
		}

		// Use the /users endpoint to list all users
		const options = {
			method: 'GET',
			url: 'https://app.asana.com/api/1.0/users',
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + token
			}
		};

		// Send the request
		let response = await axios.request(options)

		// Return the list of Asana users
		return response.data.data.map(user => ({ id: user.gid, name: user.name }))
	}
)