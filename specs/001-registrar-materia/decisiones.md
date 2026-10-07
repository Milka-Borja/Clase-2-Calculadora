# Decisiones de la historia HU-001

1. Pregunta: ¿qué rango de nota aceptas para el primer bimestre y con qué formato numérico?
   Respuesta: 0 a 20, con decimales permitidos.
   Motivo: La escala académica de referencia en este proyecto es 0 a 20, y permitir decimales evita bloquear notas válidas que aparecen en la práctica académica. Esto define el comportamiento visible del campo de nota y la validación del formulario.

2. Pregunta: ¿debe considerarse la misma materia si cambia mayúsculas o hay espacios extra al inicio/final del nombre?
   Respuesta: Sí, se ignoran las mayúsculas y los espacios al inicio/final para comparar nombres, de modo que una materia repetida no se duplica.
   Motivo: El usuario debería poder registrar una materia sin preocuparse por errores de escritura menores en el nombre; esto hace más robusto el flujo y evita duplicados visibles en la lista.

3. Pregunta: ¿un texto compuesto solo por espacios debe considerarse como nombre vacío y bloquear el guardado?
   Respuesta: Sí, un nombre que solo contiene espacios se trata como vacío.
   Motivo: La validación debe ser consistente con el caso de nombre vacío, porque de lo contrario el sistema permitiría un dato inútil y el usuario vería un comportamiento confuso al intentar guardar.

4. Pregunta: ¿la nota acepta coma decimal y punto decimal, y cómo se normaliza al guardar?
   Respuesta: Sí, acepta coma y punto, y se normaliza a un número real al guardar.
   Motivo: En español es común escribir 7,5; aceptar ambos formatos mejora la entrada del usuario y evita errores de tipeo que cambian la experiencia del formulario sin afectar la lógica de cálculo.
