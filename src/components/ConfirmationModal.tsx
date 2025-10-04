import { Modal } from "antd";
import { GButton } from "@gal-ui/components";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: "primary" | "destructive";
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonType = "primary",
}: ConfirmationModalProps) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      width={400}
      footer={[
        <GButton
          key="cancel"
          onClick={onClose}
          btn_type="secondary-gray"
        >
          {cancelText}
        </GButton>,
        <GButton
          key="confirm"
          onClick={onConfirm}
          btn_type={confirmButtonType === "destructive" ? "destructive" : "primary"}
        >
          {confirmText}
        </GButton>,
      ]}
    >
      <div className="py-4">
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
