import React from 'react';
import Button from '../../components/Button';
import '../../styles/CreateSetForm.css';
import TextField from "@mui/material/TextField";

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
                <TextField
                    label="Name"
                    variant="outlined"
                    value={setName}
                    onChange={onSetNameChange}
                    fullWidth
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={setDescription}
                    onChange={onSetDescriptionChange}
                    multiline
                    fullWidth
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
