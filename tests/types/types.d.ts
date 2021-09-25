type Response = {
    ok: boolean,
    json: () => Promise<any>,
    statusText?: string,
}

declare function fetch(url: string): Promise<Response>;
