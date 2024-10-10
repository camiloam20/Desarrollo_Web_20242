export class API {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    // Obtener la lista de comidas
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
    
    async postFood(food) {
        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(food),
        });
        console.log("Respuesta:", response);
        if (!response.ok) {
            throw new Error('Error al enviar alimento');
        }
        return await response.json();
    }

    async putFood(id, food) {
        const response = await fetch(`${this.baseURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(food),
        });
    
        if (!response.ok) {
            throw new Error('Error al modificar el alimento');
        }
        return await response.json();
    }
    


}
