import { AudioLines, CloudUpload, Inbox, Loader2, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { uploadFiles } from "../store/files";

function parseFileErrorMessage(error) {
    if (error.code === "file-too-large") {
        return "File is larger than 250MB";
    } else if (error.code === "file-invalid-type") {
        return "Invalid file type";
    } else {
        return "Unknown error. File could not be uploaded";
    }
}

// const FileCard = ({ file, onClick, onRemove }) => {
//     return (
//         <li key={file.name} className="relative w-full h-full p-6 transition-transform duration-200 rounded-md cursor-pointer bg-neutral-800 hover:scale-95">
//             <AudioLines className="text-primary lg:size-10" />
//             <button type="button" className="absolute z-30 p-1 rounded-full hover:bg-red-600 top-2 right-2" onClick={() => removeFile(file.name)}>
//                 <X />
//             </button>
//             <p className="mt-2 text-sm font-medium text-neutral-300">{file.name}</p>
//         </li>
//     );
// };

const FileUploader = ({ className, projectId }) => {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    const [rejected, setRejected] = useState([]);

    const [showAllFiles, setShowAllFiles] = useState(false);
    const [showAllRejected, setShowAllRejected] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (acceptedFiles?.length) {
            setFiles(prevFiles => [...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })), ...prevFiles,]);
        }

        if (rejectedFiles?.length) {
            setRejected(prevRejected => [...prevRejected, ...rejectedFiles]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            "audio/*": []
        },
        maxSize: 250000 * 1024
    });

    const toggleShowAllFiles = (cb) => {
        cb(prevState => !prevState);
    };

    const removeFile = fileName => {
        setFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
    };

    const removeRejectedFile = fileName => {
        setRejected(prevRejected => prevRejected.filter(({ file }) => file.name !== fileName));
    };

    const removeAllFiles = () => {
        // remove all files including rejected files
        setFiles([]);
        setRejected([]);
    };

    const handleSubmitFiles = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsUploading(true);
        try {
            const formData = new FormData();
            files.forEach(file => formData.append("file", file));

            const res = await dispatch(uploadFiles(projectId, formData));

            if (res.ok) {
                setFiles([]);
                setRejected([]);
            }
        } catch (error) {
            setErrors({ error: parseFileErrorMessage(error) });
        } finally {
            setIsUploading(false);
        }

    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmitFiles}>
            {(files.length > 0 || rejected.length > 0) && (
                <div className="flex items-center justify-end gap-4 lg:justify-start">
                    <button type="button" className="px-2 py-1 text-sm rounded-md bg-primary hover:bg-primary/90 text-neutral-800" onClick={removeAllFiles}>Clear all</button>

                    <button disabled={files.length === 0 || isUploading} className={"p-2 text-sm border rounded-md border-primary text-neutral-100 hover:bg-primary hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-100"}>
                        {isUploading ? <div className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> <span>Uploading</span></div> : <div className="flex items-center gap-2"><CloudUpload className="size-4" /> <span>Upload</span></div>}
                    </button>


                </div>
            )}

            <div {...getRootProps({
                className
            })}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <div className="flex flex-col items-center justify-center w-full py-6 space-y-1 border border-dashed rounded-md cursor-pointer bg-primary/20">
                            <Inbox className="size-8" />
                            Add files in this zone...
                        </div> :
                        <div className="flex flex-col items-center justify-center w-full py-6 space-y-2 rounded-md cursor-pointer hover:bg-neutral-500/20">
                            <UploadCloud className="size-8" />
                            Drag 'n' drop some files here, or click to select files
                            <p className="text-xs">(Only audio files are allowed. Files must be less than 250MB)</p>
                        </div>
                }
            </div>

            {/* Preview accepted files */}
            {files.length > 0 && (
                <div>

                    <h3 className="font-semibold text-center lg:text-left lg:text-lg text-neutral-100">File{files.length > 1 && "s"} to be uploaded</h3>
                    {files.length > 4 && <button type="button" className="px-2 py-1 text-sm rounded-md bg-primary hover:bg-primary/90 text-neutral-800" onClick={() => toggleShowAllFiles(setShowAllFiles)}>{showAllFiles ? "Show less" : "Show all"}</button>}

                    <ul className="grid grid-cols-1 gap-2 mt-6 md:grid-cols-2 lg:grid-cols-3">
                        {showAllFiles ?
                            <>
                                {files.map(file => (
                                    <li key={file.name} className="relative w-full h-full p-6 transition-transform duration-200 rounded-md cursor-pointer bg-neutral-800 hover:scale-95">
                                        <AudioLines className="text-primary lg:size-10" />
                                        <button type="button" className="absolute z-30 p-1 rounded-full hover:bg-red-600 top-2 right-2" onClick={() => removeFile(file.name)}>
                                            <X />
                                        </button>
                                        <p className="mt-2 text-sm font-medium text-neutral-300">{file.name}</p>
                                        <span className="text-sm font-medium text-primary">{file.size / 1024 / 1024 > 1 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : `${(file.size / 1024).toFixed(2)} KB`}</span>
                                    </li>
                                ))}

                            </> : <>
                                {files.slice(0, 3).map(file => (
                                    <li key={file.name} className="relative w-full h-full p-6 transition-transform duration-200 rounded-md cursor-pointer bg-neutral-800 hover:scale-95">
                                        <AudioLines className="text-primary lg:size-10" />
                                        <button type="button" className="absolute z-30 p-1 rounded-full hover:bg-red-600 top-2 right-2" onClick={() => removeFile(file.name)}>
                                            <X />
                                        </button>
                                        <p className="mt-2 text-sm font-medium text-neutral-300">{file.name}</p>
                                        <span className="text-sm font-medium text-primary">{file.size / 1024 / 1024 > 1 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : `${(file.size / 1024).toFixed(2)} KB`}</span>
                                    </li>
                                ))}
                                {files.length > 3 && (
                                    <p className="text-sm font-bold">...+{files.length - 3} more</p>
                                )}

                            </>
                        }
                    </ul>
                </div>
            )}


            {/* Preview rejected files */}
            {rejected.length > 0 && (
                <div>
                    <h3 className="font-bold text-center text-red-600 lg:text-left lg:text-lg">File{rejected.length > 1 && "s"} not accepted</h3>
                    {rejected.length > 4 && <button type="button" className="px-2 py-1 text-sm rounded-md bg-primary hover:bg-primary/90 text-neutral-800" onClick={() => toggleShowAllFiles(setShowAllRejected)}>{showAllRejected ? "Show less" : "Show all"}</button>}
                    <ul className="grid h-full grid-cols-1 gap-2 mt-6 md:grid-cols-2 lg:grid-cols-3">
                        {
                            showAllRejected ? (
                                <>
                                    {rejected.map(({ file, errors }) => (
                                        <li key={file.name} className="relative w-full h-full p-6 transition-transform duration-200 rounded-md cursor-pointer bg-neutral-800 hover:scale-95">
                                            <p className="mt-2 text-sm font-medium text-neutral-300">{file.name}</p>
                                            <button type="button" className="absolute z-30 p-1 rounded-full hover:bg-red-600 top-2 right-2" onClick={() => removeRejectedFile(file.name)}>
                                                <X />
                                            </button>
                                            <ul>
                                                {errors.map(error => (
                                                    <li key={error.code} className="text-xs text-red-600">{parseFileErrorMessage(error)}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </>
                            ) :
                                (
                                    <>
                                        {
                                            rejected.slice(0, 3).map(({ file, errors }) => (
                                                <li key={file.name} className="relative w-full h-full p-6 transition-transform duration-200 rounded-md cursor-pointer bg-neutral-800 hover:scale-95">
                                                    <p className="mt-2 text-sm font-medium text-neutral-300">{file.name}</p>
                                                    <button type="button" className="absolute z-30 p-1 rounded-full hover:bg-red-600 top-2 right-2" onClick={() => removeRejectedFile(file.name)}>
                                                        <X />
                                                    </button>
                                                    <ul>
                                                        {errors.map(err => (
                                                            <li key={err.code} className="text-xs text-red-600">{parseFileErrorMessage(err)}</li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))
                                        }
                                        {rejected.length > 3 && (
                                            <p className="text-sm font-bold">...+{rejected.length - 3} more</p>
                                        )}
                                    </>
                                )
                        }
                    </ul>
                </div>
            )}

        </form>
    );
};
export default FileUploader;