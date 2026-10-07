- [x] **T1. Definir la lógica pura de validación y normalización de materias.** RF-01, RF-02, RF-03, RF-05
  - Hecho cuando: las funciones puras rechazan nombre vacío o compuesto solo por espacios, aceptan notas en rango 0..20 con coma y punto y normalizan el nombre para comparación.

- [x] **T2. Definir la regla de duplicados por nombre normalizado.** RF-04
  - Hecho cuando: dos nombres equivalentes como "Historia" y "  historia " se detectan como la misma materia antes de guardar.

- [x] **T3. Crear la capa de persistencia local para materias.** RF-06
  - Hecho cuando: la lista de materias se guarda en storage y se recupera al abrir la app sin perder elementos previos.

- [x] **T4. Construir el formulario de registro y los mensajes de error.** RF-01, RF-02, RF-03, RNF-01, RNF-02
  - Hecho cuando: cada campo muestra un error específico y el formulario bloquea el envío si hay datos inválidos.

- [x] **T5. Integrar la validación previa con el guardado y la prevención de duplicados.** RF-01, RF-04, RNF-02
  - Hecho cuando: el botón de guardar no crea una materia nueva si el nombre ya existe o si la validación falla.

- [x] **T6. Normalizar la nota decimal ingresada por el usuario al guardar.** RF-05
  - Hecho cuando: `7,5` y `7.5` se guardan como el mismo valor numérico real para la materia.

- [x] **T7. Verificar la experiencia completa de registro y persistencia.** RF-01, RF-04, RF-06, RNF-01, RNF-02
  - Hecho cuando: el estudiante puede registrar una materia válida, recibe alertas oportunas y conserva sus datos tras cerrar y volver a abrir la app.

- [x] **T8. Comprobar casos límite del flujo.** RF-02, RF-03, RF-04, RF-05
  - Hecho cuando: los nombres con espacios al inicio/final, notas extremas 0 y 20, nombres con mayúsculas distintas y espacios vacíos se comportan según la spec.
