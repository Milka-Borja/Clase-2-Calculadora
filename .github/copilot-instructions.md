# Calculadora de Supletorio[cite: 2]

App móvil para estudiantes de la EPN: registrar materias y las notas de sus dos bimestres, ver el estado académico y saber qué calificación necesitan en el supletorio. Proyecto didáctico construido con Spec-Driven Development (SDD).[cite: 2]

## Stack y estructura[cite: 2]
- Expo (plantilla por defecto de create-expo-app), TypeScript y Expo Router.[cite: 2]
- Persistencia local con @react-native-async-storage/async-storage. Sin backend ni cuentas.[cite: 2]
- src/domain/: lógica pura (sin React ni AsyncStorage). src/storage/: persistencia. app/: pantallas. Pruebas junto a cada módulo, en __tests__/.[cite: 2]

## Comandos[cite: 2]
- Pruebas: npx jest[cite: 2]
- Tipos: npx tsc --noEmit[cite: 2]
- Ejecutar la app: npx expo start (solo cuando yo lo pida)[cite: 2]

## Dónde está cada cosa[cite: 2]
- docs/constitution.md: principios del proyecto.[cite: 2]
- docs/historias/: historias de usuario en Gherkin (la entrada de todo).[cite: 2]
- specs/NNN-nombre/: decisiones.md, spec.md, plan.md y tasks.md de cada historia.[cite: 2]
- MEMORY.md: estado actual del trabajo.[cite: 2]
- .github/skills/: método SDD, reglas académicas, paleta y convenciones.[cite: 2]

## Cómo trabajar[cite: 2]
1. Al empezar, lee MEMORY.md y docs/constitution.md.[cite: 2]
2. Código y nombres en inglés; textos de interfaz, comentarios y documentos en español.[cite: 2]
3. No tomes decisiones de producto o de diseño que la historia o decisiones.md no definan. Márcalas como [NECESITA ACLARACIÓN] y avísame.[cite: 2]
4. Haz solo la fase o la tarea que te pido. No avances a la siguiente.[cite: 2]
5. En la lógica, escribe primero las pruebas.[cite: 2]
6. Pregunta antes de instalar dependencias, crear archivos fuera del plan o cambiar el formato de los datos guardados.[cite: 2]
7. No reemplaces archivos existentes si la tarea no lo pide. No guardes datos sensibles. No hagas commit.[cite: 2]

## MEMORY.md[cite: 2]
Solo tiene "Estado actual" y "Próximos pasos". Al terminar una fase o tarea actualiza únicamente esas dos secciones. No copies decisiones ni contenido de la spec. Mantenlo en unas 50 líneas.[cite: 2]