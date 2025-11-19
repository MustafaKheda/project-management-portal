import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../util/apiHandler";
import { type Project } from "../types";
import CreateProjectModal from "../components/CreateProjectModel";
import AssignUserModal, { type AssignUserDto } from "../components/AssignUserModel";

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<AssignUserDto>({
        user_id: "",
        role: "viewer"
    });
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const fetchProject = async () => {
        try {
            const res = await api.get<Project>(`/projects/${id}`);
            setProject(res.data);
        } catch (err) {
            setError("Failed to load project.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProject();
    }, []);

    const deleteProject = async () => {
        setError(null);

        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await api.delete(`/projects/${id}`);
            navigate("/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Action not allowed.";
            setError(msg);
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (!project) return <p className="p-6">Project not found</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-gray-600 justify-center p-1 hover:text-gray-900 transition"
            >
                <span className="">←</span>
                <span className="font-medium">Back</span>
            </button>

            {/* Error UI */}
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded border border-red-300">
                    {error}
                </div>
            )}

            {/* TOP HEADER */}
            <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditModalOpen(true)}
                            className="inline-flex cursor-pointer min-w-20 justify-center items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white transition"
                        >
                            Edit
                        </button>

                        <button
                            onClick={deleteProject}
                            className="inline-flex cursor-pointer min-w-20 items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <hr className="my-3" />

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Assigned Users</h2>

                    <button
                        className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white transition"
                        onClick={() => setAssignModalOpen(true)}
                    >
                        + Assign User
                    </button>
                </div>
            </div>

            {/* ASSIGNED USER LIST */}
            <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-100">
                {project.assignedUsers.length === 0 ? (
                    <p className="text-gray-500">No users assigned yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {project.assignedUsers.map((u) => (
                            <li
                                key={u.id}
                                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition bg-white/10 backdrop-blur-md border border-white/20"
                            >
                                {/* USER INFO */}
                                <div>
                                    <p className="text-gray-900 font-medium">{u.email}</p>

                                    <span
                                        className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full capitalize
        ${u.role === "owner"
                                                ? "bg-purple-100 text-purple-700"
                                                : u.role === "developer"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-700"
                                            }
      `}
                                    >
                                        {u.role}
                                    </span>
                                </div>

                                {/* ACTION BUTTONS (Update + Remove) */}
                                <div className="flex items-center gap-4">

                                    <button
                                        className="hover:text-shadow-black hover:scale-105 font-medium transition"
                                        onClick={() => {
                                            setUser({ user_id: u.id, role: u.role });
                                            setIsEdit(true);
                                            setAssignModalOpen(true);
                                        }}
                                    >
                                        Update
                                    </button>

                                    <button
                                        className="hover:text-shadow-black hover:scale-105 font-medium transition"
                                        onClick={async () => {
                                            try {
                                                await api.delete(`/projects/${id}/users/${u.id}`);
                                                fetchProject();
                                            } catch (err: any) {
                                                const msg = err.response?.data?.message || "Action not allowed.";
                                                setError(msg);
                                            }
                                        }}
                                    >
                                        Remove
                                    </button>

                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* MODALS */}
            <AssignUserModal
                isEdit={isEdit}
                userRole={user}
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                projectId={id!}
                onSuccess={fetchProject}
            />

            <CreateProjectModal
                isEdit={true}
                projectData={{
                    id: project.id,
                    name: project.name,
                    description: project.description,
                }}
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSuccess={fetchProject}
            />
        </div>
    );
}
