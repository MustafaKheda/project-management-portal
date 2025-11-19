import { useEffect, useState } from "react";
import Modal from "./Model";
import api from "../util/apiHandler";

export type ProjectUserRole = "owner" | "developer" | "viewer";

export interface AssignUserDto {
    user_id: string;
    role: ProjectUserRole;
}
interface User {
    id: string;
    email: string;
}

interface Props {
    isEdit?: boolean;
    userRole?: AssignUserDto;
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AssignUserModal({
    isOpen,
    onClose,
    onSuccess,
    projectId,
    isEdit,
    userRole
}: Props) {

    const [user, setUser] = useState<AssignUserDto>({
        user_id: userRole?.user_id || "",
        role: userRole?.role || "viewer"
    });

    const [userList, setUserList] = useState<User[]>([]);


    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isEdit && userRole) {
            setUser(userRole);
        }
    }, [isEdit, userRole, isOpen]);

    const handleReset = () => {
        setUser({
            user_id: "",
            role: "viewer"
        });
        setError(null);
        onClose();
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get<User[]>(`/user/list`);
            setUserList(res.data);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Something went wrong!";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        setUser(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(null);
    };

    const assignUser = async () => {
        try {
            setLoading(true);
            setError(null);

            await api.post(`/projects/${projectId}/users`, user);

            handleReset();
            onSuccess && onSuccess();
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Something went wrong!";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const updateAssignedUser = async () => {
        try {
            setLoading(true);
            setError(null);

            await api.put(`/projects/${projectId}/users/${user.user_id}`, user);

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
        <Modal
            isOpen={isOpen}
            onClose={handleReset}
            title={isEdit ? "Update User Role" : "Assign User"}
        >
            <div className="space-y-3">

                {/* ERROR */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded border border-red-300">
                        {error}
                    </div>
                )}

                {/* SELECT USER */}
                <select
                    name="user_id"
                    value={user.user_id}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    disabled={isEdit || loading}
                >
                    <option value="" disabled>Select user...</option>
                    {userList?.map((user: User) => (
                        <option key={user.id} value={user.id}>
                            {user.email}
                        </option>
                    ))}
                </select>

                {/* ROLE RADIO */}
                <div className="flex space-x-6 pt-1">
                    <label className="font-medium text-sm">Role:</label>
                    {["owner", "developer", "viewer"].map((role) => (
                        <label key={role} className="flex items-center space-x-1 capitalize">
                            <input
                                type="radio"
                                name="role"     // FIXED
                                value={role}
                                checked={user.role === role}
                                onChange={handleChange}
                                disabled={loading}
                                className="form-radio text-blue-600"
                            />
                            <span>{role}</span>
                        </label>
                    ))}
                </div>

                {/* BUTTON */}
                <button
                    disabled={loading}
                    onClick={isEdit ? updateAssignedUser : assignUser}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                    {loading
                        ? isEdit ? "Updating..." : "Assigning..."
                        : isEdit ? "Update Role" : "Assign User"}
                </button>
            </div>
        </Modal>
    );
}
