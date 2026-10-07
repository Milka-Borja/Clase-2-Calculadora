# Plan de la historia HU-001 — Registrar una materia

## 1. Archivos previstos y responsabilidades

- `src/domain/subject.ts`: lógica pura de validación, normalización y comparación. Responde a RF-01, RF-02, RF-03, RF-04, RF-05, RF-06 en la lógica del dominio.
- `src/domain/subject.test.ts`: pruebas unitarias de validación, duplicados y normalización. Cubre los casos límite del dominio y la verificación de regresión.
- `src/storage/subjectStorage.ts`: persistencia con AsyncStorage para guardar y recuperar la lista de materias. Responde a RF-06.
- `src/storage/subjectStorage.test.ts`: pruebas del flujo de almacenamiento, carga y consistencia de datos.
- `src/app/registrar-materia.tsx` (o la pantalla equivalente de la HU): formulario de entrada, mensajes de error y envío del formulario. Responde a RF-01 a RF-06, RNF-01 y RNF-02 en la interfaz.
- `src/components/SubjectForm.tsx` (opcional si se prefiera separar la vista del contenedor): componente visual del campo de nombre, nota y botón de guardar.

## 2. Funciones puras de lógica

- `normalizeSubjectName(value: string): string`
  - Elimina espacios iniciales/finales y normaliza mayúsculas para comparar nombres.
  - Regla: `trim().toLocaleLowerCase()` o equivalente seguro para este proyecto.

- `parseFirstBimesterGrade(raw: string | number | null): { ok: boolean; value?: number; error?: string }`
  - Acepta números reales dentro de 0..20.
  - Normaliza coma y punto decimal.
  - Rechaza vacíos, no numéricos y valores fuera del rango permitido.

- `validateSubjectInput(name: string, grade: string): { ok: boolean; errors?: { name?: string; grade?: string } }`
  - Verifica que el nombre no esté vacío después de trim y que la nota sea válida.
  - Se ejecuta antes de guardar cualquier materia.

- `isDuplicateSubject(existingSubjects, candidateName): boolean`
  - Compara nombres con normalización para evitar duplicados por mayúsculas y espacios.

- `addSubject(existingSubjects, draft): { ok: boolean; subject?: Subject; errors?: ... }`
  - Encapsula la validación completa antes de agregar una materia.

## 3. Persistencia

- Se usará `@react-native-async-storage/async-storage` para guardar una colección de materias en una clave tipo `subjects:subject-list`.
- El modelo persistido será una lista de objetos con:
  - `id`: identificador local estable.
  - `name`: nombre normalizado para mostrar al usuario.
  - `firstBimesterGrade`: número real guardado en 0..20.
- Antes de guardar, la UI y la lógica validan el contenido para evitar escribir datos inválidos. La persistencia no debe realizar validaciones de negocio equivalentes a las del dominio; solo serializa y recupera.
- Se prevé que la carga inicial use una lista vacía si no existe ninguna materia guardada.

## 4. Algoritmo en pseudocódigo

```text
function normalizeSubjectName(name):
  return trim(name).toLowerCase()

function parseGrade(raw):
  if raw is null or trim(raw) == "":
    return error("Nota requerida")

  normalized = raw.replace(".", ".").replace(",", ".")
  value = Number(normalized)

  if value is NaN:
    return error("Nota inválida")

  if value < 0 or value > 20:
    return error("Nota fuera de rango")

  return ok(value)

function validateSubjectInput(name, grade):
  if normalizeSubjectName(name) == "":
    return error(name="El nombre es obligatorio")

  gradeResult = parseGrade(grade)
  if gradeResult is error:
    return error(grade=gradeResult.error)

  return ok()

function addSubject(existingList, draft):
  validation = validateSubjectInput(draft.name, draft.grade)
  if validation fails:
    return validation

  normalizedName = normalizeSubjectName(draft.name)
  if any existingList.nameNormalized == normalizedName:
    return error(name="La materia ya existe")

  subject = {
    id: generateId(),
    name: trim(draft.name),
    nameNormalized: normalizedName,
    firstBimesterGrade: gradeResult.value
  }

  return ok([...existingList, subject])

onSubmit(formValues):
  result = addSubject(currentSubjects, formValues)
  if result is error:
    render field-specific messages
    stop save
  else:
    persist(result.subjects)
    show updated list
```

## 5. Cómo se pinta en la interfaz

- La pantalla de registro muestra dos campos principales: nombre de la materia y nota del primer bimestre.
- El campo de nombre se valida antes del guardado y muestra un mensaje claro cuando está vacío o solo contiene espacios.
- El campo de nota acepta valores decimales con coma o punto, pero se presenta como texto libre y se valida antes de almacenar.
- Cuando la materia ya existe con el mismo nombre normalizado, la UI muestra una advertencia de materia repetida y no duplica la entrada.
- Cuando la operación termina con éxito, la materia aparece en la lista académica y el formulario queda listo para una nueva captura.
- El diseño debe ser mobile-first y accesible, con mensajes de error próximos a cada campo para cumplir RNF-01 y RNF-02.

## 6. Decisiones técnicas justificadas

- Decisión 1 (`decisiones.md`): rango 0 a 20 con decimales. Se validará con un parseo real numérico para aceptar `7,5` y `7.5` de forma equivalente. Alternativa descartada: exigir solo enteros; se rechazó porque la nota académica real puede incluir decimales y bloquearía entradas válidas.
- Decisión 2 (`decisiones.md`): comparación de materia normalizada por mayúsculas y espacios de borde. Se usará `trim + lowerCase` antes de comparar. Alternativa descartada: comparar el texto literal; se rechazó porque el usuario puede escribir el mismo nombre con diferencias menores que no deben crear duplicados.
- Decisión 3 (`decisiones.md`): nombre con solo espacios es vacío. Se bloqueará la validación del nombre antes del guardar. Alternativa descartada: aceptar espacios como nombre válido; se rechazó porque el dato no tiene sentido y la experiencia del usuario sería confusa.
- Decisión 4 (`decisiones.md`): normalización de coma y punto decimal. Se convertirá cualquier entrada decimal de estilo español a un número real al guardar. Alternativa descartada: permitir solo un tipo de separador; se descartó por compatibilidad con la escritura cotidiana del estudiante.

## 7. Estrategia de pruebas con Jest

- Pruebas unitarias puras para cada función del dominio: validación de nombre vacío, rango de nota, nota decimal con coma y punto, y nombre repetido por normalización.
- Pruebas de almacenamiento: guardar una lista, recuperar datos persistidos y mantener la lista cuando se reabre la app.
- Verificación de casos límite: `"  Matemáticas "`, `"   "`, `0`, `20`, `7,5`, `7.5`, `"Historia"` y `"historia"`.
- Cobertura esperada de RF: RF-01 a RF-06 y RNF-01/RNF-02 con pruebas centrándose en el dominio y la persistencia. La capa de UI se validará con la lista de comprobación manual del flujo de la tarea.

## 8. Mapeo de requisitos funcionales

- RF-01: guardar una materia válida en dominio + UI.
- RF-02: bloqueo de nombre vacío o espacios.
- RF-03: bloqueo de nota vacía/no numérica/fuera de rango.
- RF-04: evitar duplicados por nombre normalizado.
- RF-05: normalizar decimal con coma o punto.
- RF-06: conservación de materiales tras cerrar la app.
- RNF-01: mensajes claros del campo que debe corregirse.
- RNF-02: validación previa al guardado.
