import React from 'react';
import type { ThemeState } from '../../pages/Layout';
import { Modal } from '../templates/Modal';



type ModalParametreProps = {
  open: boolean;
  onClose: () => void;
  theme: ThemeState;
  setTheme: React.Dispatch<React.SetStateAction<ThemeState>>;

};

const ModalParametre = ({ open, onClose, theme, setTheme }: ModalParametreProps) => {
    return (
        <>
            <Modal open={open} onClose={onClose} title="Paramètres d’affichage">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Mode */}
                <div className="space-y-2 2xl:text-xs text-[11px]">
                    <div className=" font-medium">Mode</div>
                    <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 ">
                        <input
                        type="radio"
                        name="mode"
                        checked={theme.mode === "light"}
                        onChange={() => setTheme((t) => ({ ...t, mode: "light" }))}
                        />
                        Clair
                    </label>
                    <label className="inline-flex items-center gap-2 ">
                        <input
                        type="radio"
                        name="mode"
                        checked={theme.mode === "dark"}
                        onChange={() => setTheme((t) => ({ ...t, mode: "dark" }))}
                        />
                        Sombre
                    </label>
                    </div>
                </div>

                {/* Couleur primaire */}
                <div className="space-y-2 2xl:text-xs text-[11px]">
                    <div className="font-medium">Couleur primaire</div>
                    <div className="flex flex-wrap items-center gap-2">
                    {(["indigo","emerald","rose","amber","sky"] as ThemeState["primary"][]).map((c) => (
                        <button
                        key={c}
                        onClick={() => setTheme((t) => ({ ...t, primary: c }))}
                        className={`h-8 w-8 rounded-full ring-2 ${
                            theme.primary === c ? 'ring-[var(--primary-ring)] ring-offset-2' : 'ring-transparent'
                        }`}
                        style={{
                            background:
                            c === "indigo"  ? "#6366F1" :
                            c === "emerald" ? "#10B981" :
                            c === "rose"    ? "#F43F5E" :
                            c === "amber"   ? "#F59E0B" : "#0EA5E9"
                        }}
                        aria-label={c}
                        />
                    ))}
                    </div>
                </div>

                {/* Densité */}
                <div className="space-y-2 2xl:text-xs text-[11px]">
                    <div className="font-medium">Densité</div>
                    <select
                    value={theme.density}
                    onChange={(e) => setTheme((t) => ({ ...t, density: e.target.value as ThemeState["density"] }))}
                    className="rounded-xl px-3 py-2"
                    style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
                    >
                    <option value="normal">Normale</option>
                    <option value="compact">Compacte</option>
                    </select>
                </div>

                {/* Aperçu rapide */}
                <div className="space-y-2 2xl:text-xs text-[11px]">
                    <div className="font-medium">Aperçu</div>
                    <div
                    className="rounded-2xl p-4"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                    >
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Carte</div>
                    <div className="mt-1 rounded-xl px-3 py-2" style={{ background: "var(--primary-bg)", color: "var(--primary-text)" }}>
                        Couleur primaire
                    </div>
                    </div>
                </div>
                </div>
            </Modal>
        </>
    );
}

export default ModalParametre;
