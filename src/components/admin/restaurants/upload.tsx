// pages/admin/restaurants/upload.tsx
import React, { useState, useCallback } from 'react';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { fetchAdminAPI } from '@/utils/adminApi';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface UploadResult {
  message: string;
  successCount: number;
  errorCount: number;
  errors?: Array<{ row: number | string; message: string; data: unknown }>;
}

const AdminBulkUploadPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const mutation = useMutation<UploadResult, Error, FormData>(
        (formData) => fetchAdminAPI('/restaurants/bulk-upload', {
            method: 'POST',
            body: formData,
            // No Content-Type header needed for FormData
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) {
                 // Throw an error with message from backend if possible
                throw new Error(data.message || `Upload failed with status: ${res.status}`);
            }
            return data;
        }),
        {
            onSuccess: (data) => {
                 toast.success(`Upload finished! ${data.message}`);
                 setSelectedFile(null); // Clear file input on success
                 // Optionally redirect or refetch restaurant list
            },
            onError: (error) => {
                toast.error(`Upload failed: ${error.message}`);
            },
        }
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
             mutation.reset(); // Reset mutation state if a new file is selected
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.error("Please select a file first.");
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile); // The backend expects the file under the key 'file'
        mutation.mutate(formData);
    };

     // --- Drag and Drop Handlers ---
     const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow drop
        e.stopPropagation();
        setIsDragging(true); // Keep highlighting when dragging over
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // TODO: Add file type validation here as well
            setSelectedFile(e.dataTransfer.files[0]);
            mutation.reset();
            e.dataTransfer.clearData(); // Clean up
        }
    }, [mutation]);


    return (
        <AdminProtectedRoute>
            <AdminLayout>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Bulk Upload Restaurants</h1>

                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                     <div
                        className={`border-2 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} border-dashed rounded-lg p-10 text-center cursor-pointer mb-6 transition-colors duration-200 ease-in-out`}
                         onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload-input')?.click()} // Trigger file input click
                    >
                        <ArrowUpTrayIcon className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <input
                            id="file-upload-input"
                            type="file"
                            accept=".csv, application/json" // Accept CSV and JSON files
                            onChange={handleFileChange}
                            className="hidden" // Hide the actual input, use the div for interaction
                        />
                         {selectedFile ? (
                            <p className="text-sm text-gray-700 font-medium">
                                Selected: <span className="text-indigo-600">{selectedFile.name}</span> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                         ) : (
                            <p className="text-sm text-gray-500">
                                <span className={`font-medium ${isDragging ? 'text-indigo-600' : 'text-indigo-500'}`}>Click to upload</span> or drag and drop
                                <br /> CSV or JSON file
                             </p>
                         )}
                         {!selectedFile && <p className="text-xs text-gray-400 mt-1">Max. 10MB</p>}
                    </div>


                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || mutation.isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isLoading ? 'Uploading...' : 'Upload File'}
                    </button>

                    {/* Display Results */}
                     {mutation.isSuccess && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                            <h3 className="text-lg font-semibold text-green-800">Upload Successful</h3>
                             <p className="text-sm text-green-700">{mutation.data.message}</p>
                             {mutation.data.errorCount > 0 && mutation.data.errors && (
                                 <div className="mt-3">
                                     <h4 className="font-semibold text-red-700">Errors ({mutation.data.errorCount}):</h4>
                                     <ul className="list-disc list-inside text-sm text-red-600 max-h-40 overflow-y-auto">
                                         {mutation.data.errors.map((err, index) => (
                                             <li key={index}>Row {err.row}: {err.message}</li>
                                         ))}
                                     </ul>
                                 </div>
                             )}
                        </div>
                    )}
                     {mutation.isError && (
                         <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                            <h3 className="text-lg font-semibold ">Upload Failed</h3>
                            <p className="text-sm">{mutation.error?.message || 'An unknown error occurred.'}</p>
                         </div>
                     )}
                </div>
            </AdminLayout>
        </AdminProtectedRoute>
    );
};

export default AdminBulkUploadPage;