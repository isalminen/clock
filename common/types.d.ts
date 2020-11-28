export interface Location {
    lat: number;
    lon: number;
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
