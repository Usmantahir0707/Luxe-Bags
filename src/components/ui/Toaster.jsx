// src/components/ui/Toaster.jsx
// Small wrapper for Sonner toaster (single-file)
import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  return (
    <SonnerToaster position="bottom-right" closeButton />
  );
}
