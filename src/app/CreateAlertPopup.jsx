"use client";

import React, { useState } from 'react';
import AlertTypeForm from './AlertTypeForm';
import AlertForm from './AlertForm';

export default function CreateAlertPopup({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleFormSubmit = () => {
    // After the alert is created, we call onSubmit to refresh data
    onSubmit();
  };

  const handleBack = () => {
    setStep(1);
  }

  return (
    <>
      {step === 1 && <AlertTypeForm onSelectType={handleSelectType} />}
      {step === 2 && (
        <AlertForm
          alertType={selectedType}
          onClose={onClose}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
        />
      )}
    </>
  );
}
