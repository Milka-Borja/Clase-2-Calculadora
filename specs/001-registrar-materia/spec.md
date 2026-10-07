# Spec 001 — Registrar una materia

Estado: aprobada
HU de origen: docs/historias/HU-001.md

## Contexto y objetivo
El estudiante necesita guardar una materia con la nota de su primer bimestre para verla en la lista académica y completar la información cuando reciba la nota del segundo bimestre. El sistema debe aceptar datos válidos, rechazar entradas incompletas o inválidas y conservar la información entre sesiones sin duplicarla.

## Usuarios
- Estudiante que registra y consulta materias en la aplicación.

## Historias de usuario
- El estudiante puede registrar una materia nueva con nombre y nota del primer bimestre.
- El estudiante recibe avisos claros cuando faltan datos o los valores no son válidos.
- El estudiante no puede registrar dos veces la misma materia con diferencias menores en mayúsculas o espacios.
- El estudiante conserva las materias registradas aunque cierre y vuelva a abrir la aplicación.

## Definiciones
- Nombre normalizado: un nombre de materia tras ignorar mayúsculas y los espacios al inicio y al final.
- Nota válida: un valor numérico real comprendido entre 0 y 20 inclusive, con decimales permitidos.

## Requisitos funcionales
- RF-01: CUANDO el estudiante envía un nombre y una nota del primer bimestre válidos, EL SISTEMA guarda la materia y la muestra en la lista de materias. Origen: Escenario: Guardar una materia.
- RF-02: SI el nombre de la materia está vacío o está compuesto solo por espacios, ENTONCES EL SISTEMA rechaza el guardado y exige corregir el campo antes de continuar. Origen: Escenario: Datos incompletos o inválidos; Decisión 3.
- RF-03: SI la nota del primer bimestre está vacía, no es numérica o está fuera del rango permitido de 0 a 20, ENTONCES EL SISTEMA rechaza el guardado y solicita corregir la nota. Origen: Escenario: Datos incompletos o inválidos; Decisión 1.
- RF-04: SI el estudiante intenta registrar una materia cuyo nombre normalizado coincide con una ya existente, ENTONCES EL SISTEMA no duplica la materia y muestra una advertencia de materia repetida. Origen: Escenario: Materia repetida; Decisión 2.
- RF-05: CUANDO el estudiante ingresa una nota con coma o punto decimal, EL SISTEMA la normaliza a un valor numérico real al guardar la materia. Origen: Decisión 4.
- RF-06: MIENTRAS existan materias guardadas, EL SISTEMA conserva cada materia y su nota cuando el estudiante cierra y vuelve a abrir la aplicación. Origen: Escenario: Conservar mis datos.

## Requisitos no funcionales
- RNF-01: El sistema debe indicar claramente qué campo debe corregirse cuando la entrada no es válida.
- RNF-02: La validación de nombre y nota debe producirse antes de guardar cualquier materia.

## Casos límite
- Nombre con espacios al inicio y al final: "  Matemáticas " debe ser aceptado como el mismo nombre que "Matemáticas" para la comparación de duplicados.
- Nombre compuesto solo por espacios: "   " debe bloquear el guardado.
- Nota 0 y nota 20 deben ser aceptadas como válidas.
- Nota 7,5 y 7.5 deben tratarse como la misma nota al guardar.
- Materia con mayúsculas distintas: "Historia" y "historia" deben considerarse la misma para evitar duplicados.

## Fuera de alcance
- Registrar notas del segundo bimestre.
- Editar o eliminar materias ya guardadas.
- Validar el rendimiento académico más allá de la materia y la nota del primer bimestre.
- Sincronizar datos con un servicio externo o cuenta de usuario.

## Criterios de finalización
- El estudiante puede guardar una materia nueva con nombre y nota del primer bimestre.
- El sistema bloquea guardados con nombre o nota vacíos o inválidos e informa qué corregir.
- El sistema evita duplicados de materias con nombres equivalentes por mayúsculas y espacios.
- Las materias guardadas siguen disponibles después de cerrar y volver a abrir la aplicación.

## Dudas abiertas
- Ninguna.
