export interface AssignedUser {
  id: string;
  email: string;
  role: "owner" | "developer" | "viewer";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  assignedUsers: AssignedUser[];
}
