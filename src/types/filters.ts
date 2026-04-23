export type QueryFilter = {
    categoryId: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    searchTerm: string;
}