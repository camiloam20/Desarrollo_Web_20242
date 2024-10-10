import { API } from './api.js';

export class DOM {
    constructor() {
        this.api = new API('http://ec2-3-138-183-128.us-east-2.compute.amazonaws.com:4010/foods');
        this.List = document.getElementById('mostrar-comidas');
        
        this.EventListener();
    }

    EventListener() {
        document.getElementById('buscar-comida').addEventListener('click', async () => {
            try {
                const foods = await this.api.fetch_api();
                this.Imprimir(foods);
            } catch (error) {
                console.warn(error.message);
            }
        });
    }

    Imprimir(foods) {

        this.List.innerHTML = '';

        foods.forEach(food => {

            const comida = document.createElement('div');
            comida.className = 'item';
            comida.innerHTML = `
                <h3>${food.name}</h3>
                <p>Descripción: ${food.description}</p>
                <p>Ingredientes: ${food.ingredients.join(', ')}</p>
                <img src="${food.image}" alt="${food.name}">
            `;
            this.List.appendChild(comida);

        });
    }

}
