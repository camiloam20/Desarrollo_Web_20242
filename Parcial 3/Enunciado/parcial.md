# Problema a resolver
A partir del diagrama E-R dado construya:
* script para crear la base de datos y las tablas correspondientes
* script para crear 4 especialidades (medicina general, cardiología, urología, fisiología, pediatría)
* script para agregar 5 médicos (usar las 4 especialidades) y 10 pacientes
* API REST para:  
  * Médico (la suma de los 3 últimos dígitos del documento es impar):
    * /patient/:patientId
      * GET: Obtener los datos del paciente espedificado
    * /patient/:patientId/appointment
      * GET: listar todas las citas asignadas al paciente especificado
    * /doctor/login: inicia sesión como médico, usando email y password. Retorna JWT con 1 hora de vigencia
    * /doctor/appointment
      * GET: listar todas las citas asignadas al médico
        * Se puede filtrar por fecha, parando un query string: [?date=<DD-MM-YYYY>]
        * Por ejemplo: /doctor/appointment?date=20-11-2024 mostrará las citas del médico en esa fecha
      * POST: crear una nueva cita (paciente, fecha, hora)
    * /doctor/appointment/:appointmentId
      * PUT: editar una cita específica (paciente, fecha, hora)
      * DELETE: eliminar una cita específica
  * Paciente (la suma de los últimos 3 dígitos del documentos es par):
    * /patient/login: inicia sesión como paciente, usando email y password. Retorna JWT con 30 minutos de vigencia
    * /patient/appointment
      * GET: listar todas las citas asignadas al paciente
        * Se puede filtrar por fecha, pasando un query string: [?date=<DD/MM/YYYY>]
        * Por ejemplo: /doctor/appointment?date=20-11-2024 mostrará las citas del paciene para esa fecha
      * POST: asignar una nueva cita al paciente (medico, fecha, hora)
    * /patient/appointment/:appointmentId
      * PUT: editar una cita específica (medico, fecha, hora)
      * DELETE: eliminar una cita específica
    * /doctor/:doctorId
      * GET: Obtener los datos del médico especificado
    * /doctor/:doctorId/appointment
      * GET: listar todas las citas asignadas al médico especificado  
* docker compose para correr los dos servicios (db y api)
  * Mantener los datos sensibles en variables de entorno de los servicios o archivos .env
# Restricciones
* Usar Node.js + express
* La base de datos debe ser postgres
* Usar módulos ES (NO usar sintaxis commonJS)
* Proteger endpoints con JWT, según el rol correspondiente
* Hacer validación de entradas con express-validator
* Divida la lógica en routes-controllers-services-models
* Utilice middleware propios, de ser necesario, y almacénelos en una carpeta aparte
* Usar clases
* Retorne los códigos de estado de acuerdo al resultado de la operación
* Solo puede haber 1 cita asignada a un médico en una fecha y hora específica
* Solo puede haber 1 cita asignada a un paciente en una fecha y hora específica
