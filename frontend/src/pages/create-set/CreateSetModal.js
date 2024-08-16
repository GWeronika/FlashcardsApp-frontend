import React from 'react';
import Button from '../../components/Button';
import '../../styles/CreateSetForm.css';

const CreateSetModal = ({
                            isOpen,
                            title,
                            setName,
                            setDescription,
                            onSetNameChange,
                            onSetDescriptionChange,
                            onSubmit,
                            onCancel,
                        }) => {
    if (!isOpen) return null;

    return (
        <div className="create-form-container">
            <div className="modal">
                <h2>{title}</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={setName}
                    onChange={onSetNameChange}
                />
                <textarea
                    placeholder="Description"
                    value={setDescription}
                    onChange={onSetDescriptionChange}
                    rows={1}
                />
                <div className="modal-buttons">
                    <Button text="Submit" onClick={onSubmit} />
                    <Button text="Cancel" onClick={onCancel} />
                </div>
            </div>
        </div>
    );
};

export default CreateSetModal;
