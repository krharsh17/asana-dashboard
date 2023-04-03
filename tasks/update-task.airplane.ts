import airplane from "airplane"
import axios from "axios";

export default airplane.task(
	{
		slug: "update_task",
		name: "update-task",
		// Set env variables for the task from Airplane's config variables
		envVars: {
			ASANA_PAT: { config: "ASANA_PAT" }
		},
		// Set the parameters for the task. These will be captured automatically from an Airplane View's Form component when this task is called from that component
		parameters: {
			id: {
				type: "shorttext",
				name: "ID",
				description: "The ID of the Asana task",
				required: true
			},
			name: {
				type: "shorttext",
				name: "Name",
				description: "The name of the Asana task",
				required: false,
			},
			project_id: {
				type: "shorttext",
				name: "Project ID",
				description: "The project ID for the Asana task",
				required: false,
			},
			assignee_id: {
				type: "shorttext",
				name: "Assignee ID",
				description: "The ID of the assignee for the Asana task",
				required: false,
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
	// This is your task's entrypoint. When your task is executed, this
	// function will be called.
	async (params) => {

		// Extract the API token from env variables
		const token = process.env.ASANA_PAT ?? "";

		// If the API token is empty, notify the user
		if (token === "") {
			return { message: "Invalid API Key" };
		}

		// Use the /tasks/task_id endpoint to update an new task
		const options = {
			method: 'PUT',
			url: 'https://app.asana.com/api/1.0/tasks/' + params.id,
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
					projects: params.project_id ? [params.project_id] : undefined,
					assignee: params.assignee_id
				}
			}
		};

		let response

		try {
			response = await axios.request(options)
		} catch (e) {
			console.log(e)
		}

		// Return the result of the update-task operation
		return response.data.data;
	}
)

// 1203633604772185