import { InterestPoint, InterestPointResponse } from "../types";
import { API_URL } from '@env';


export async function fetchInterestPoints(): Promise<InterestPointResponse> {
    const url = `${API_URL}/interest-points`;
    const response = await fetch(url)
    .then(res => res.json())
    .catch(err => {
        console.error("Error fetching interest points:", err);
        throw err;
    });

    return response.data;
}

export async function fetchInterestPointById(id: number): Promise<InterestPoint | null> {
    const url = `${API_URL}/interest-points/${id}`;
    const response = await fetch(url)
    .then(res => res.json())
    .catch(err => {
        console.error(`Error fetching interest point with id ${id}:`, err);
        throw err;
    });

    return response.data || null;
}