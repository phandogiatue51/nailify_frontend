// stores/useBookingCart.ts
import { create } from "zustand";
import { ServiceItem, Collection } from "@/types/database";

interface BookingCartItem {
  type: "service" | "collection";
  data: ServiceItem | Collection;
  sourceId: string; // shopId or artistId
  sourceType: "shop" | "artist";
}

interface BookingCartStore {
  items: BookingCartItem[];
  sourceId: string | null; // Which shop/artist these items belong to
  sourceType: "shop" | "artist" | null;

  addItem: (item: BookingCartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  hasItems: () => boolean;
  getTotalPrice: () => number;
  setSource: (sourceId: string, sourceType: "shop" | "artist") => void;
}

export const useBookingCart = create<BookingCartStore>((set, get) => ({
  items: [],
  sourceId: null,
  sourceType: null,

  addItem: (item) => {
    const state = get();

    // Check if trying to add from different source
    if (state.sourceId && state.sourceId !== item.sourceId) {
      // Show warning or auto-clear? Let's auto-clear for simplicity
      set({
        items: [item],
        sourceId: item.sourceId,
        sourceType: item.sourceType,
      });
    } else {
      // Add to existing cart
      const exists = state.items.some(
        (i) =>
          i.type === item.type && (i.data as any).id === (item.data as any).id,
      );

      if (!exists) {
        set({
          items: [...state.items, item],
          sourceId: item.sourceId,
          sourceType: item.sourceType,
        });
      }
    }
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => (item.data as any).id !== itemId),
    }));
  },

  clearCart: () => {
    set({ items: [], sourceId: null, sourceType: null });
  },

  hasItems: () => get().items.length > 0,

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => {
      return sum + Number((item.data as any).price || 0);
    }, 0);
  },

  setSource: (sourceId, sourceType) => {
    set({ sourceId, sourceType });
  },
}));
