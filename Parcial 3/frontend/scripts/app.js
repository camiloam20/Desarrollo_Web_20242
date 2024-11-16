// app.js
const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const dateFilter = document.getElementById('dateFilter');
const appointmentsTable = document.getElementById('appointmentsTable');
const appointmentModal = document.getElementById('appointmentModal');
const appointmentForm = document.getElementById('appointmentForm');
const modalError = document.getElementById('modalError');
const logoutBtn = document.getElementById('logoutBtn');
const newAppointmentBtn = document.getElementById('newAppointmentBtn');
const closeModal = document.querySelector('.close');

// Funciones de la API
async function makeRequest(endpoint, options = {}) {
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (response.status === 401) {
            logout();
            return null;
        }

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Funciones de autenticacion
async function login(email, password) {
    try {
        const data = await makeRequest('/doctor/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        token = data.token;
        localStorage.setItem('token', token);
        showDashboard();
    } catch (error) {
        loginError.textContent = 'Credenciales inválidas';
        loginError.classList.remove('hidden');
    }
}

function logout() {
    token = null;
    localStorage.removeItem('token');
    showLogin();
}

// Funciones para el login y dashboard
function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    loginForm.reset();
    loginError.classList.add('hidden');
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    loadAppointments();
}

async function loadAppointments() {
    try {
        const date = dateFilter.value;
        const endpoint = '/doctor/appointment' + (date ? `?date=${date}` : '');
        const appointments = await makeRequest(endpoint);
        
        appointmentsTable.innerHTML = appointments.map(appointment => `
            <tr>
                <td>${appointment.patient_name}</td>
                <td>${new Date(appointment.date).toLocaleDateString()}</td>
                <td>${appointment.hour}</td>
                <td>
                    <button onclick="editAppointment(${appointment.id})" class="btn btn-warning">Editar</button>
                    <button onclick="deleteAppointment(${appointment.id})" class="btn btn-danger">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function loadPatients() {
    try {
        const patients = await makeRequest('/patients');
        const select = document.getElementById('patientId');
        select.innerHTML = patients.map(patient => 
            `<option value="${patient.id}">${patient.name}</option>`
        ).join('');
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

// Funciones para las citas medicas
async function createAppointment(data) {
    try {
        await makeRequest('/doctor/appointment', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        closeAppointmentModal();
        loadAppointments();
    } catch (error) {
        modalError.textContent = error.message;
        modalError.classList.remove('hidden');
    }
}

async function updateAppointment(id, data) {
    try {
        await makeRequest(`/doctor/appointment/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        closeAppointmentModal();
        loadAppointments();
    } catch (error) {
        modalError.textContent = error.message;
        modalError.classList.remove('hidden');
    }
}

async function deleteAppointment(id) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
        try {
            await makeRequest(`/doctor/appointment/${id}`, {
                method: 'DELETE'
            });
            loadAppointments();
        } catch (error) {
            alert('Error al eliminar la cita');
        }
    }
}

function showAppointmentModal(appointment = null) {
    document.getElementById('modalTitle').textContent = 
        appointment ? 'Editar Cita' : 'Nueva Cita';
    appointmentForm.reset();
    modalError.classList.add('hidden');
    
    if (appointment) {
        document.getElementById('patientId').value = appointment.patient_id;
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('appointmentTime').value = appointment.hour;
        appointmentForm.dataset.id = appointment.id;
    } else {
        delete appointmentForm.dataset.id;
    }
    
    appointmentModal.style.display = 'block';
    loadPatients();
}

function closeAppointmentModal() {
    appointmentModal.style.display = 'none';
    appointmentForm.reset();
}

// Event Listeners
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        patientId: document.getElementById('patientId').value,
        date: document.getElementById('appointmentDate').value,
        hour: document.getElementById('appointmentTime').value
    };
    
    const id = appointmentForm.dataset.id;
    if (id) {
        await updateAppointment(id, data);
    } else {
        await createAppointment(data);
    }
});

dateFilter.addEventListener('change', loadAppointments);
logoutBtn.addEventListener('click', logout);
newAppointmentBtn.addEventListener('click', () => showAppointmentModal());
closeModal.addEventListener('click', closeAppointmentModal);

// Carga inicial
if (token) {
    showDashboard();
} else {
    showLogin();
}