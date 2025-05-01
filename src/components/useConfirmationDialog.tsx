import React, { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface ConfirmationHandlerProps {
  title: string;
  description: string;
  onConfirm: () => void;
  variant: "cancel" | "approve" | "reject" | "confirmation";
}

export const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<Omit<ConfirmationHandlerProps, "onConfirm"> & { onConfirm?: () => void }>({
    title: "",
    description: "",
    variant: "confirmation",
  });

  const showConfirmationDialog = (props: ConfirmationHandlerProps) => {
    setDialogProps({ ...props });
    setIsOpen(true);
  };

  const closeConfirmationDialog = () => {
    setIsOpen(false);
    setDialogProps({ title: "", description: "", variant: "confirmation", onConfirm: undefined });
  };

  const handleConfirm = () => {
    dialogProps.onConfirm?.();
    closeConfirmationDialog();
  };

  const Confirmation = () => (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={closeConfirmationDialog}
      onConfirm={handleConfirm}
      title={dialogProps.title}
      description={dialogProps.description}
      variant={dialogProps.variant}
    />
  );

  return { showConfirmationDialog, closeConfirmationDialog, Confirmation };
};