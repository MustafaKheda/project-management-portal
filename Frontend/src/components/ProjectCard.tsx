import { Link } from "react-router-dom";
import { type Project } from "../types";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="group border rounded-xl p-5 bg-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
        {project.name}
      </h2>

      {/* Description */}
      <p className="text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
        {project.description || "No description provided."}
      </p>

      {/* Stats */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-600">
          👥 Assigned: <b>{project.assignedUsers?.length || 0}</b>
        </span>

        <span className="text-gray-500 text-xs">
          ID: {project.id.slice(0, 6)}...
        </span>
      </div>

      {/* Button */}
      <Link
        to={`/projects/${project.id}`}
        className="mt-4 w-full block bg-gray-900 text-white py-2.5 text-center rounded-lg font-medium hover:bg-black transition-all"
      >
        View Details →
      </Link>
    </div>
  );
}

