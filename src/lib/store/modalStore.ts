import { create } from 'zustand';

interface ModalState {
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isUpgradeModalOpen: false,
  openUpgradeModal: () => set({ isUpgradeModalOpen: true }),
  closeUpgradeModal: () => set({ isUpgradeModalOpen: false }),
}));
