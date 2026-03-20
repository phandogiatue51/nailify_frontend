import { ServiceItem } from "@/types/database";
import { Collection } from "@/types/database";

interface ServiceItemType {
    id?: string;
    name?: string;
    price?: number;
    estimatedDuration?: number;
}

interface CollectionType {
    id?: string;
    name?: string;
    totalPrice?: number;
    estimatedDuration?: number;
    calculatedDuration?: number;
}

/**
 * Calculate total price from collection and/or services
 */
export const calculateTotalPrice = (
    selectedCollection?: CollectionType | null,
    selectedItems: ServiceItemType[] = []
): number => {
    const collectionPrice = selectedCollection?.totalPrice || 0;
    const itemsPrice = selectedItems.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
    );
    return collectionPrice + itemsPrice;
};

/**
 * Calculate total duration from collection and/or services
 */
export const calculateTotalDuration = (
    selectedCollection?: CollectionType | null,
    selectedItems: ServiceItemType[] = []
): number => {
    const collectionDuration =
        selectedCollection?.estimatedDuration ||
        selectedCollection?.calculatedDuration ||
        0;
    const itemsDuration = selectedItems.reduce(
        (sum, item) => sum + (item.estimatedDuration || 0),
        0
    );
    return collectionDuration + itemsDuration;
};

/**
 * Calculate total items count (collection counts as 1 if selected)
 */
export const calculateTotalItems = (
    selectedCollection?: CollectionType | null,
    selectedItems: ServiceItemType[] = []
): number => {
    return (selectedCollection ? 1 : 0) + selectedItems.length;
};

/**
 * Get collection price with fallback
 */
export const getCollectionPrice = (collection?: CollectionType | null): number => {
    return collection?.totalPrice || 0;
};

/**
 * Get collection duration with fallback
 */
export const getCollectionDuration = (collection?: CollectionType | null): number => {
    return collection?.estimatedDuration || collection?.calculatedDuration || 0;
};

/**
 * Get total price from services
 */
export const getServicesTotalPrice = (items: ServiceItemType[] = []): number => {
    return items.reduce((sum, item) => sum + Number(item.price || 0), 0);
};

/**
 * Get total duration from services
 */
export const getServicesTotalDuration = (items: ServiceItemType[] = []): number => {
    return items.reduce((sum, item) => sum + (item.estimatedDuration || 0), 0);
};

/**
 * Format price to VND currency
 */
export const formatPrice = (price: number): string => {
    return price.toLocaleString() + " đ";
};

/**
 * Get booking summary object
 */
export const getBookingSummary = (
    selectedCollection?: CollectionType | null,
    selectedItems: ServiceItemType[] = []
) => {
    const collectionPrice = getCollectionPrice(selectedCollection);
    const collectionDuration = getCollectionDuration(selectedCollection);
    const itemsPrice = getServicesTotalPrice(selectedItems);
    const itemsDuration = getServicesTotalDuration(selectedItems);

    return {
        totalPrice: collectionPrice + itemsPrice,
        totalDuration: collectionDuration + itemsDuration,
        collectionPrice,
        collectionDuration,
        itemsPrice,
        itemsDuration,
        hasCollection: !!selectedCollection,
        hasServices: selectedItems.length > 0,
        totalItems: (selectedCollection ? 1 : 0) + selectedItems.length,
    };
};

/**
 * Get item count display text
 */
export const getItemCountText = (
    selectedCollection?: CollectionType | null,
    selectedItems: ServiceItemType[] = []
): string => {
    const total = calculateTotalItems(selectedCollection, selectedItems);
    if (total === 0) return "Không có dịch vụ";
    if (total === 1 && selectedCollection) return "1 set nail";
    if (total === 1 && selectedItems.length === 1) return "1 dịch vụ";
    return `${total} dịch vụ`;
};

/**
 * Check if booking has any items
 */
export const hasBookingItems = (
    selectedCollection?: CollectionType | null,
    selectedItems: ServiceItemType[] = []
): boolean => {
    return !!selectedCollection || selectedItems.length > 0;
};