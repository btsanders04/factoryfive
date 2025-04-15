import React from "react";
import Scanner from "./Scanner";

interface ScannerModalProps {
  open: boolean;
  onClose: () => void;
}

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 8,
  maxWidth: 420,
  width: "95vw",
  padding: 24,
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  position: "relative",
};

export default function ScannerModal({ open, onClose }: ScannerModalProps) {
  if (!open) return null;
  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#eee",
            border: "none",
            borderRadius: 4,
            fontSize: 18,
            padding: "2px 8px",
            cursor: "pointer",
          }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <Scanner />
      </div>
    </div>
  );
}
