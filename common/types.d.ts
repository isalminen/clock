export interface Location {
    latitude: number;
    longitude: number;
}

export interface CompanionRequest {
    request: string;
    params?: any; 
}

export interface CompanionResponse {
    response: string;
    data: any;
}

export type LocationCallback = (loc: Location) => void;
