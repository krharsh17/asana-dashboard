import airplane from "airplane"
import axios from 'axios'

export default airplane.task(
	{
		slug: "list_open_tasks",
		name: "list-open-tasks",
		// Set env variables for the task from Airplane's config variables
		envVars: {
			ASANA_PAT: { config: "ASANA_PAT" }
		},
		parameters: {
			project_id: {
				type: 'shorttext',
				name: "Project ID",
				description: "Project ID to fetch tasks from"
			}
		}
	},
	// This is your task's entrypoint. When your task is executed, this
	// function will be called.
	async (params) => {
		// Extract the API token from env variables
		const token = process.env.ASANA_PAT ?? "";

		// If the API token is empty, send an empty response to the view
		if (token === "") {
			return [];
		}

		// Use the /tasks endpoint to list all tasks in a given project
		const options = {
			method: 'GET',
			url: 'https://app.asana.com/api/1.0/tasks?project=' + params.project_id,
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + token
			}
		};

		// Send the request
		let response = await axios.request(options)

		let tasks = response.data.data.map(async task => {
			// Use the /tasks endpoint to list more details for each task
			const options = {
				method: 'GET',
				url: 'https://app.asana.com/api/1.0/tasks/' + task.gid,
				headers: {
					accept: 'application/json',
					authorization: 'Bearer ' + token
				}
			};

			// Send the request
			let response = await axios.request(options)

			return {
				id: response.data.data.gid,
				name: response.data.data.name,
				created_at: response.data.data.created_at,
				due_on: response.data.data.due_on,
				last_modified_at: response.data.data.modified_at,
				assignee: response.data.data.assignee.name,
				notes: response.data.data.notes
			}

		});

		// Return the list of Asana tasks
		return Promise.all(tasks)
	}
)