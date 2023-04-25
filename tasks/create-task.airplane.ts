import airplane from "airplane"
import axios from "axios";

export default airplane.task(
	{
		slug: "create_task",
		name: "create-task",
		// Set env variables for the task from Airplane's config variables
		envVars: {
			ASANA_PAT: { config: "ASANA_PAT" }
		},
		// Set the parameters for the task. These will be captured automatically from an Airplane View's Form component when this task is called from that component
		parameters: {
			name: {
				type: "shorttext",
				name: "Name",
				description: "The name of the Asana task",
			},
			project_id: {
				type: "shorttext",
				name: "Project ID",
				description: "The project ID for the Asana task",
			},
			assignee_id: {
				type: "shorttext",
				name: "Assignee ID",
				description: "The ID of the assignee for the Asana task",
			},
			notes: {
				type: "longtext",
				name: "Notes",
				description: "Notes for the Asana task",
				required: false,
			},
			due_date: {
				type: "date",
				name: "Due On",
				description: "The due date of the Asana task",
				required: false,
			},
		},
	},
	// This is your task's entry point. When your task is executed, this
	// function will be called.
	async (params) => {

		// Extract the API token from env variables
		const token = process.env.ASANA_PAT ?? "";

		// If the API token is empty, notify the user
		if (token === "") {
			return { message: "Invalid API Key" };
		}

		// Use the /tasks endpoint to create a new task
		const options = {
			method: 'POST',
			url: 'https://app.asana.com/api/1.0/tasks',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
				authorization: 'Bearer ' + token
			},
			data: {
				data: {
					name: params.name,
					due_on: params.due_date,
					notes: params.notes,
					projects: [params.project_id],
					assignee: params.assignee_id
				}
			}
		};

		let response = await axios.request(options)

		// Return the result of the create-task operation
		return response.data.data;
	}
)
