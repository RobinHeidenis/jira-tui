import type { ExtractAtomValue } from "jotai";
import { atom } from "jotai";
import { store } from "./store.js";

export const modalsAtom = atom({
  moveIssue: false,
  updatePriority: false,
  updateAssignee: false,
});

export const inputDisabledAtom = atom((get) =>
  Object.values(get(modalsAtom)).some((v) => v === true),
);

export const openModal = (modal: keyof ExtractAtomValue<typeof modalsAtom>) => {
  store.set(modalsAtom, (prev) => ({ ...prev, [modal]: true }));
};

export const closeModal = (
  modal: keyof ExtractAtomValue<typeof modalsAtom>,
) => {
  store.set(modalsAtom, (prev) => ({ ...prev, [modal]: false }));
};
