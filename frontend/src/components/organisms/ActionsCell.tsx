import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { ModalConfirmDelete } from "../modal/ModalConfirmDelete";

type Props = {
  onEdit?: () => void; // le ? rend cette prop optionnelle
  onDelete: () => Promise<void> | void;
  titleBtnDelete?: string;
};


export const ActionsCell: React.FC<Props> = ({ onEdit, onDelete, titleBtnDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setLoadingDelete(true);
      await onDelete(); // ici onDelete retourne une Promise
      setConfirmOpen(false);
    } catch (err) {
      console.error("Erreur suppression :", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className=" text-right flex flex-row items-center gap-1 justify-center">
        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={onEdit}
            aria-label="Edit"
            title="Edit"
            className="inline-flex items-center justify-center rounded-md p-2 cursor-pointer active:scale-95 transition"
          >
            <MdEdit />
          </button>
        )}


        {/* Delete Button */}
        <button
          onClick={() => setConfirmOpen(true)}
          aria-label="Delete"
          title="Delete"
          className={`${!titleBtnDelete ? "inline-flex items-center justify-center rounded-md p-2 cursor-pointer text-red-600 active:scale-95 transition" : "rounded-sm bg-red-400 px-4 py-2 font-medium text-white hover:opacity-95 disabled:opacity-50"} `}
        >
          {!titleBtnDelete ? (<FaTrashAlt />) : (`${titleBtnDelete}`)}
        </button>
      </div>

      {/* Confirmation Modal */}
      <ModalConfirmDelete
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        loading={loadingDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
