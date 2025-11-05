import { Modal } from "../templates/Modal";


type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
};

export const ModalConfirmDelete: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Confirmation de suppression">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Êtes-vous sûr de vouloir supprimer cet élément ? <br />
          Cette action est irréversible.
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
};


