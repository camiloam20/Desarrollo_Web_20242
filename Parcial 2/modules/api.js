
export class API {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async fetch_api() {
        try {
            const response = await fetch(this.baseURL);
            if (!response.ok) {
                throw new Error(`Error al obtener los alimentos: ${response.status}`);
            }
            const foods = await response.json();
            console.log("Foods:", foods);
            return foods;
        } catch (error) {
            console.error("Error al contactar con la API:", error);
            return [];
        }
    }
}
