const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export async function getMyProfile() {
    const requestOptions = {
        method: "GET",
        credentials: 'include' 
    }

    const response = await fetch(`${BACKEND_URL}/me`, requestOptions)

    if (response.status !== 200) {
        throw new Error("Unable to fetch user");
    }

    const data = await response.json();
    return data;

}