import React, { useState, useEffect } from 'react';
import '../styles/CreateSetForm.css';
import CreateSetModal from './create-set/CreateSetModal';
import EditSetPage from "./edit-set/EditSetPage";

const CreateSetForm = ({ isLoggedIn, currentUser, onRedirect, onRedirectToSetsPage, enableModal = true }) => {
    const [setName, setSetName] = useState('');
    const [setDescription, setSetDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(enableModal);
    const [setObject, setSetObject] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            alert('To create a set, an account is required.');
            setTimeout(onRedirect, 500);
        }
    }, [isLoggedIn, onRedirect]);

    const handleSetNameChange = (e) => setSetName(e.target.value);
    const handleSetDescriptionChange = (e) => setSetDescription(e.target.value);

    const handleCreateSet = async () => {
        if (setName.trim() !== '' && setDescription.trim() !== '') {
            setIsModalOpen(false);
            const params = new URLSearchParams();
            params.append('name', setName);
            params.append('date', new Date().toISOString().split('T')[0]);
            params.append('description', setDescription);
            params.append('userJson', JSON.stringify(currentUser));

            try {
                const response = await fetch('/api/set/add/description', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                });
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setSetObject(result);
            } catch (error) {
                alert(`Failed to add set: ${error.message}`);
            }
        }
    };

    return (
        <>
            <CreateSetModal
                isOpen={isModalOpen}
                title="Create new set"
                setName={setName}
                setDescription={setDescription}
                onSetNameChange={handleSetNameChange}
                onSetDescriptionChange={handleSetDescriptionChange}
                onSubmit={handleCreateSet}
                onCancel={onRedirectToSetsPage}
            />
            {!isModalOpen && setObject && (
                <EditSetPage setObject={setObject} onRedirectToSetsPage={onRedirectToSetsPage} />
            )}
        </>
    );
};

export default CreateSetForm;
