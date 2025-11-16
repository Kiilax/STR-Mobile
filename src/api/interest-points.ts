import { InterestPoint, InterestPointResponse } from "../types";

const API_BASE_URL = "http://192.168.0.153:3000";

export async function fetchInterestPoints(): Promise<InterestPointResponse> {
    const url = `${API_BASE_URL}/interest-points`;
    const response = await fetch(url)
    .then(res => res.json())
    .catch(err => {
        console.error("Error fetching interest points:", err);
        throw err;
    });

    return response.data;
}

export async function fetchInterestPointById(id: number): Promise<InterestPoint | null> {
    const url = `${API_BASE_URL}/interest-points/${id}`;
    const response = await fetch(url)
    .then(res => res.json())
    .catch(err => {
        console.error(`Error fetching interest point with id ${id}:`, err);
        throw err;
    });

    return response.data || null;
}