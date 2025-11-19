import { useEffect, useState } from "react";
import Modal from "./Model";
import api from "../util/apiHandler";

export interface CreateProjectDto {
    name: string;
    description?: string;
}

interface Props {
    isEdit?: boolean;
    projectData?: {
        id: string;
        name: string;
        description: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // optional callback to refresh dashboard
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess, projectData, isEdit }: Props) {
    const [form, setForm] = useState<CreateProjectDto>({
        name: "",
        description: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleReset = () => {
        setForm({
            name: "",
            description: "",
        });
        setError(null);
        onClose();
    }

    useEffect(() => {
        if (isEdit && projectData) {
            setForm({
                name: projectData.name,
                description: projectData.description,
            });
        }
    }, [isEdit, projectData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    };

    const createProject = async () => {
        if (!form.name.trim()) return alert("Project name is required!");

        try {
            setLoading(true);
            setError(null);

            await api.post("/projects", form);

            handleReset();
            onSuccess && onSuccess();
        } catch (err: any) {
            // backend error message
            const msg = err?.response?.data?.message || "Something went wrong!";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async () => {
        if (!form.name.trim()) return alert("Project name is required!");
        try {
            setLoading(true);
            setError(null);
            await api.put(`/projects/${projectData?.id}`, form);
            handleReset();
            onSuccess && onSuccess();
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Something went wrong!";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleReset} title={`${isEdit ? "Update" : "Create New"} Project`}>
            <div className="space-y-3">
                {/* ERROR UI */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded border border-red-300">
                        {error}
                    </div>
                )}
                <input
                    name="name"
                    className="border w-full p-2 rounded"
                    placeholder="Project Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    className="border w-full p-2 rounded"
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={handleChange}
                />

                <button
                    disabled={loading}
                    onClick={isEdit ? updateProject : createProject}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                    {loading ? isEdit ? "Updating" : "Creating" : isEdit ? "Update Project" : "Create Project"}
                </button>
            </div>
        </Modal>
    );
}
