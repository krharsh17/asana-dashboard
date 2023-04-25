import airplane from "airplane"
import axios from 'axios'

export default airplane.task(
	{
		slug: "list_projects",
		name: "list-projects",
		// Set env variables for the task from Airplane's config variables
		envVars: {
			ASANA_PAT: { config: "ASANA_PAT" }
		},
	},
	// This is your task's entry point. When your task is executed, this
	// function will be called.
	async () => {
		// Extract the API token from env variables
		const token = process.env.ASANA_PAT ?? "";

		// If the API token is empty, send an empty response to the view
		if (token === "") {
			return [];
		}

		// Use the /projects endpoint to list all projects
		const options = {
			method: 'GET',
			url: 'https://app.asana.com/api/1.0/projects',
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + token
			}
		};

		// Send the request
		let response = await axios.request(options)

		// Return the list of Asana projects
		return response.data.data.map(project => ({ id: project.gid, name: project.name }))
	}
)
