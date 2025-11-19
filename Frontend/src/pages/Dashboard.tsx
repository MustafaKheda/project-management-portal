import { useEffect, useState } from "react";
import api from "../util/apiHandler";
import { type Project } from "../types";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModel";

type ApiResponse = {
    projects: Project[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
};

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [meta, setMeta] = useState<ApiResponse["meta"] | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState(""); // Immediate input

    const [open, setOpen] = useState(false);

    const fetchProjects = async () => {
        const res = await api.get<ApiResponse>(
            `/projects?page=${page}&limit=${limit}&search=${search}`
        );

        setProjects(res.data.projects);
        setMeta(res.data.meta);
        setPage(res.data.meta.page);
    };
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(1); // reset to page 1 when search changes
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchInput]);
    useEffect(() => {
        fetchProjects();
    }, [page, limit, search]);

    const totalPages = meta?.totalPages || 1;

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your projects and team activity efficiently.</p>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className=" px-6 bg-gray-900 max-h-10 text-white rounded-lg hover:bg-black transition"
                >
                    Create Project
                </button>
            </div>

            {/* Filters Row (Search + Select Limit) */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black"
                />

                {/* Limit Dropdown */}
                <select
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                    className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black"
                >
                    <option value="6">6 per page</option>
                    <option value="12">12 per page</option>
                    <option value="24">24 per page</option>
                </select>
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>

                    {/* Numbered Pagination */}
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => setPage(num)}
                                className={`px-4 py-2 rounded-lg border ${num === page
                                    ? "bg-gray-900 text-white"
                                    : "bg-white hover:bg-gray-100"
                                    } transition`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <EmptyState />
            )}

            <CreateProjectModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSuccess={() => fetchProjects()}
            />
        </div>
    );
}

function EmptyState() {
    return (
        <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mt-4">No Projects Found</h3>
            <p className="text-gray-500 mt-1">Start by creating your first project.</p>
        </div>
    );
}
