export interface ApiRequest {
    amount: string | number,
    category?: string | number,
    difficulty?: string,
    type?: string,
    encode?: string,
    token?: string
}