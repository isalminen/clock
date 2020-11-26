export interface CompanionRequest<T, U> {
    request: T;
    params?: U; 
}

export interface CompanionResponse {
    response: string;
    data: any;
}
