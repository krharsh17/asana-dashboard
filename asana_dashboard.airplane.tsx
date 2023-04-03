import {
  Stack,
  Table,
  Heading,
  useComponentState,
  Select,
  TextInput,
  Form,
  DatePicker,
  Textarea,
  useTaskMutation,
} from "@airplane/views";
import airplane from "airplane";


const AsanaDashboard = () => {

  const asanaBaseUrl = "https://app.asana.com/0/";

  // Component states
  const { values: asanaTaskFormValues } = useComponentState("createTaskForm");
  const openTicketsState = useComponentState("openTickets")
  const { value: projectId, setValue: setProjectId } = useComponentState("projectId")

  // Mutation to call the create-task task with the form data
  const { mutate: createAsanaTask } = useTaskMutation({
    slug: "create_task",
    params: {
      ...asanaTaskFormValues,
    },
    onSuccess: (output) => {
      alert(`Created Asana Task ${output[0].id}`);
    },
    onError: (error) => {
      alert(`Failed creating Asana Task with error: ${error}`);
    },
  });

  // Link template to view the task in Asana
  const openInAsanaLink = (taskId: string) => (asanaBaseUrl + "/" + projectId + "/" + taskId)

  return (
    <Stack>

    {/* Project select dropdown at the top of the page to allow viewing dashboard for each project */}
      <Select
        id="projectId"
        label="Project"
        task="list_projects"
        outputTransform={(projects) => {
          if (projects.length === 1) setProjectId(projects[0].id)
          return projects.map((p) => ({
            value: p.id,
            label: p.name,
          }))
        }
        }
      />
      <Heading>Asana dashboard</Heading>
      {/* Table to show the list of open tasks and allow updating them */}
      <Table
        id={"openTasks"}
        title="Open Asana Tasks"
        task={{ slug: "list_open_tasks", params: { project_id: projectId || "" }, refetchInterval: 10000 }}
        rowSelection="single"
        columns={openTasksCols}
        rowActions={[{
          variant: "subtle",
          href: (row) => openInAsanaLink(row.id),
          label: "Open in Asana",
        },
        // With this tiny object, you can integrate the update task with your table to update Asana tasks
         {
          slug: 'update_task',
          label: "Update"
        }
        ]}
      />
      {/* Form to create a new task */}
      <Heading level={5}>Create a new Task</Heading>
      <Form
        id="createTaskForm"
        onSubmit={() => {
          createAsanaTask();
          openTicketsState.clearSelection();
        }}
        resetOnSubmit
      >
        <TextInput id="name" label="Task name" required />
        <Select
          id="project_id"
          label="Project"
          task="list_projects"
          outputTransform={(projects) =>
            projects.map((t) => ({
              value: t.id,
              label: t.name,
            }))
          }
          required
        />
        <Select
          id="assignee_id"
          label="Assignee"
          task="list_users"
          outputTransform={(users) =>
            users.map((u) => ({
              value: u.id,
              label: u.name,
            }))
          }
          required
        />
        <DatePicker id="due_date" label="Due date" />
        <Textarea id="notes" label="Task Notes" />
      </Form>
    </Stack>
  );
};

// Columns in the open tasks table
const openTasksCols = [
  { label: "ID", accessor: "id" },
  { label: "Name", accessor: "name", canEdit: true }, // You need to set canEdit to true for a field to become editable
  { label: "Created At", accessor: "created_at" },
  { label: "Assignee Name", accessor: "assignee" },
  { label: "Last Modified At", accessor: "last_modified_at" },
  { label: "Notes", accessor: "notes", canEdit: true }, // You need to set canEdit to true for a field to become editable
];

export default airplane.view(
  {
    slug: "asana_dashboard",
    name: "Asana dashboard",
  },
  AsanaDashboard
);
