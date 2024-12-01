import { useEffect, useState } from "react";
import { useModal } from "../context/Modal";
import { useDispatch } from "react-redux";
import { fetchClient, fetchEditClient } from "../store/clients";
import { fetchProject, fetchProjects } from "../store/projects";

const EditClientFormPopup = ({ projectId, clientId }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const res = await dispatch(fetchClient(clientId));
                if (res && res.name && res.email) {
                    setClientName(res.name);
                    setClientEmail(res.email);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchClientData();
    }, [dispatch, clientId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        const clientData = {
            name: clientName,
            email: clientEmail,
            projectId
        };
        return dispatch(fetchEditClient(clientId, clientData))
            .then(() => {
                closeModal();
                dispatch(fetchProjects());
                dispatch(fetchProject(projectId));
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            }).finally(() => {
                setSubmitting(false);
            });
    };
    return (
        <div className="relative w-full p-8 space-y-6 lg:max-w-md min-h-80">
            <h3 className="text-2xl font-bold">Edit client</h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="clientName" className="text-sm uppercase text-neutral-400">Client Name</label>
                    <input type="text" name="clientName" placeholder="Enter client name..." className="w-full p-2 text-sm bg-transparent border-b outline-none border-neutral-500 text-neutral-400 focus:border-primary" maxLength={100} required value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="clientEmail" name="clientEmail" className="text-sm uppercase text-neutral-400">Client Email</label>
                    <input type="email" placeholder="Enter client name..." className="w-full p-2 text-sm bg-transparent border-b outline-none border-neutral-500 text-neutral-400 focus:border-primary" maxLength={100} required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                    {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </div>

                <div className="absolute flex gap-4 text-sm bottom-4 right-4">
                    <button type="button" className="p-2 rounded-md bg-neutral-600 hover:bg-neutral-600/80" onClick={closeModal}>Take me back</button>
                    <button className="p-2 rounded-md bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-neutral-800" disabled={submitting || !clientName || !clientEmail}>{submitting ? "Editing Client..." : "Edit Client"}</button>
                </div>
            </form>
        </div>
    );
};
export default EditClientFormPopup;