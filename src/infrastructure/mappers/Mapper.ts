export interface IMapper<T, U, V>{
    toDto?(): T,
    toDomain?(): U,
    toPersistense?(): V,
}