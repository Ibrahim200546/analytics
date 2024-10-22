export interface Paginated<Item> {
    '@context': string;
    '@id': string;
    '@type': string;
    'hydra:member': Item[];
    'hydra:totalItems': number;
}
