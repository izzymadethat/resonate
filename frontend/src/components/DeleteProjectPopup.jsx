import { useModal } from "../context/Modal";

const DeleteProjectPopup = ({ projectId, onDelete }) => {
    const { closeModal } = useModal();

    const handleDelete = () => {
        onDelete(projectId);
        closeModal();
    };

    return (
        <div className="relative w-full max-w-md p-12 space-y-6 min-h-80">
            <h3 className="text-2xl font-bold">Confirm Delete Project</h3>
            <hr />

            <p>Are you sure you want to delete this project? This action cannot be undone!</p>

            <div className="absolute flex gap-4 text-sm bottom-4 right-4">
                <button className="p-2 rounded-md bg-neutral-600 hover:bg-neutral-600/80" onClick={closeModal}>Take me back</button>
                <button className="p-2 bg-red-600 rounded-md hover:bg-red-600/80" onClick={handleDelete}>Delete Project</button>
            </div>
        </div>
    );
};
export default DeleteProjectPopup;