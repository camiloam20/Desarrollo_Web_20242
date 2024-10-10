import { API } from './api.js';

export class DOM {
    constructor() {
        this.api = new API('http://ec2-3-138-183-128.us-east-2.compute.amazonaws.com:4010/foods');
        this.List = document.getElementById('mostrar-comidas');

        this.formCrear = document.getElementById('crear-form');
        this.formModificar = document.getElementById('modificar-form');
        this.selectComidas = document.getElementById('comidas-modificar');

        this.EventListener();
        this.api.fetch_api(); // Cargar comidas al iniciar
    }

    EventListener() {
        // Consultar comidas
        document.getElementById('buscar-comida').addEventListener('click', async () => {
            try {
                const foods = await this.api.fetch_api();
                this.Imprimir(foods);
            } catch (error) {
                console.warn(error.message);
            }
        });

        // Crear comida
        this.formCrear.addEventListener('submit', async (event) => {
            event.preventDefault();

            const newFood = {
                name: document.getElementById("nombrefood").value,
                description: document.getElementById("desfood").value,
                ingredients: document.getElementById("ingfood").value.split(',').map(ing => ing.trim()),
                image: document.getElementById("urlfood").value
            };

            try {
                const createdFood = await this.api.postFood(newFood);
                this.Imprimir([createdFood]); 
                this.api.fetch_api(); 
            } catch (error) {
                console.error("Error al crear la comida:", error);
            }
        });

        this.formModificar.addEventListener('comidas-modificar', async (event) => {
            event.preventDefault();

            const foodId = this.selectComidas.value;
            const updatedFood = {
                name: document.getElementById("nombrefood-mod").value,
                description: document.getElementById("desfood-mod").value,
                ingredients: document.getElementById("ingfood-mod").value.split(',').map(ing => ing.trim()),
                image: document.getElementById("urlfood-mod").value
            };

            try {
                await this.api.putFood(foodId, updatedFood); 
                console.log("Comida modificada con éxito.");
                this.api.fetch_api();
            } catch (error) {
                console.error("Error al modificar la comida:", error);
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
