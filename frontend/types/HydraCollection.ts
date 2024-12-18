export default interface HydraCollection<T> {
    '@context': string;
    '@id': string;
    '@type': 'hydra:Collection';
    'hydra:totalItems': number;
    'hydra:member': T[],
    'hydra:view': {
        '@id': string;
        '@type': 'hydra:PartialCollectionView';
        'hydra:first': string;
        'hydra:last': string;
        'hydra:next': string;
    }
}
