/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import type { LeadDataInterface, LeadInterface, LeadStatus } from "../../types/LeadInterface";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { getUserConnected } from "../../features/user/selectors";
import { useSelector } from "react-redux";
import { createLead, updateLead } from "../../features/leads/thunk";
import { toast } from "react-toastify";



export function ModalCreateUpdateLead({
  open,
  onClose,
  title,
  editing, 
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  editing: LeadInterface | null;
}) {
  const dispatch = useAppDispatch();
  const userConnected = useSelector(getUserConnected)

  const status = useAppSelector((s) => s.lead.status);
  const error = useAppSelector((s) => s.lead.error as string | null);

  const [form, setForm] = useState<LeadInterface>({
    id: "",
    firstName: "",
    email: "",
    lastName: "",  
    phone: "",
    company:"",
    status: "NEW",
    assignedToUserId: "",
    createdAt: "",
    updatedAt: "",
    assignedToUser: null
  });

  const isEditing = !!editing;

  useEffect(() => {
    if (!open) return;

    if (editing) {
      setForm({
        id: editing.id,
        firstName: editing.firstName ?? "",
        email: editing.email ?? "",
        lastName: editing.lastName ?? "",  
        phone: editing.phone ?? "",
        company: editing.company ?? "",
        status: editing.status ?? "NEW",
        assignedToUserId: editing.assignedToUserId ?? "",
        createdAt: editing.createdAt ?? new Date(),
        updatedAt: editing.updatedAt ?? new Date(),
        assignedToUser: editing.assignedToUser ?? null
      });
    } else {
      setForm({
        id: "",
        firstName: "",
        email: "",
        lastName: "",  
        phone: "",
        company:"",
        status: "NEW",
        assignedToUserId: "",
        createdAt: "",
        updatedAt: "",
        assignedToUser: null
      });
    }

    
  }, [open, editing]);

 
  const canSave = useMemo(() => {
    if (!form.firstName) return false;
    if (!form.lastName) return false;
    if (!form.email) return false;
    if (!form.phone) return false;
    if (!form.company) return false;
    return true;
  }, [form.company, form.email, form.firstName, form.lastName, form.phone]);

  async function onSave() {
    try {
      if (isEditing) {
        const payloadJson: LeadInterface & { id: string } = {
          id: form.id!,
          lastName: form.lastName.trim(),
          firstName: form.firstName.trim(),
          email: (form.email ?? "").trim(),
          phone: form.phone,
          company: form.company,
          status: form.status,
          assignedToUserId: userConnected?.id || "",
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
          assignedToUser: form.assignedToUser
          
        };

        await dispatch(updateLead(payloadJson)).unwrap();
        toast.success(`Le lead ${editing.firstName} a été bien modifié avec succès!`);
      }
      else{
        const payloadJson: LeadDataInterface & { id: string } = {
          id: form.id!,
          lastName: form.lastName.trim(),
          firstName: form.firstName.trim(),
          email: (form.email ?? "").trim(),
          phone: form.phone,
          company: form.company,
          status: form.status,
          assignedToUserId: userConnected?.id || ""
        };
        await dispatch(createLead(payloadJson)).unwrap();
        toast.success(`Un nouveau lead est bien crée avec succès !`);
      }

      onClose();
    } catch (e) {
      // erreur gérée par redux
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--panel)] shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base 2xl:text-sm text-[11px] font-semibold">{title}</h3>
          <div className="flex items-center gap-2">


            <button
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 transition"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="h-1 w-full border-b-1 border-gray-800 mb-4 opacity-20"></div>

        <div className="grid grid-cols-1 gap-4 2xl:text-xs text-[11px]">
          {/* firstName */}
          <div className="grid gap-2">
            <label className=" text-gray-600">Nom *</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="nom du client"
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />
          </div>

          {/* lastName */}
          <div className="grid gap-2">
            <label className=" text-gray-600">Prénom *</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Pseudo du client"
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <label className="text-gray-600">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email du client"
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />
          </div>


          {/* phone */}
          <div className="grid gap-2">
            <label className="text-gray-600">Téléphone</label>
            <input
              type="number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />
          </div>

          {/* company */}
          <div className="grid gap-2">
            <label className="text-gray-600">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />
          </div>

          {/* Role */}
          <div className="grid gap-2">
            <label className="text-gray-600">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as LeadStatus })
              }
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            >
              <option value="NEW">Nouveau</option>
              <option value="CONTACTED">Contacté</option>
              <option value="RECONTACT">En relance</option>
              <option value="APPOINTMENT">RDV pris</option>
              <option value="QUOTESENT">Devis envoyé</option>
            </select>
          </div>

         
          {/* Error */}
          {error && <div className="text-rose-600">{error}</div>}

          {/* Actions */}
          <div className="mt-1 flex items-center justify-end gap-2  2xl:text-xs text-[11px]">
            <button
              onClick={onClose}
              className="rounded-sm bg-red-400 px-4 py-2 font-medium text-white hover:opacity-95 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              disabled={!canSave || status === "loading"}
              className="rounded-sm bg-green-700 px-4 py-2 font-medium text-white hover:opacity-95 disabled:opacity-50"
            >
               {status === "loading" ? (isEditing ? "Enregistrement..." : "Création...") : (isEditing ? "Modifier" : "Créer")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
