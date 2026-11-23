# Entrega de Amexa para Dani

Preparada el **9 de noviembre de 2026**.

## Procedencia y alcance

- Proyecto: Amexa, analizador regulatorio de software sanitario.
- Fuente: copia local de trabajo `analizador-regulatorio`, cuyo remoto es el repositorio privado [BrunoMarconi/annexa](https://github.com/BrunoMarconi/annexa).
- Revisión de referencia de `main`: `80d0b26f7a3176e57810e02e260e30899deaece2`, del 8 de noviembre de 2026.
- Los 119 archivos seleccionados de la carpeta local coincidían, byte por byte, con sus archivos en esa revisión. El único archivo adicional del árbol del repositorio es el marcador vacío `entrada/.gitkeep`, incluido también en la entrega.
- Se conserva todo el código de aplicación, las pruebas, las herramientas, la web de presentación con sus recursos, los ejemplos ficticios y la base de conocimiento con sus fuentes.
- El proyecto original y el repositorio remoto no se han modificado. No se ha publicado ni desplegado nada ni se han enviado archivos a Dani.

## Preparación de la copia

Se han excluido los archivos `.env` y `.env.local`, el historial y la configuración de Git, los enlaces locales de alojamiento, los entornos virtuales, las dependencias instaladas, las cachés, los archivos compilados, las copias de respaldo de la interfaz, las entradas locales y los resultados anteriores. Tampoco se incluyen bases de datos locales ni accesos a servicios.

La plantilla `.env.example` contiene campos privados vacíos. El `.gitignore` de la copia se ha ampliado para excluir otras variantes de `.env` y archivos locales. El código de la aplicación no se ha cambiado.

El README original se conserva en `docs/REFERENCIA_TECNICA.md`. En la raíz hay una guía sencilla nueva, `README.md`, y un mensaje inicial para trabajar con Claude, `CONTINUAR_CON_CLAUDE.md`. Estos cambios se han realizado únicamente en la copia de entrega.

La carpeta `kb/fuentes` se conserva porque contiene recursos usados por el proyecto; no son una instalación local de dependencias ni una caché prescindible.

## Comprobaciones realizadas

- **119 pruebas superadas y 4 omitidas**, en Windows con Python 3.10.10. Las cuatro omitidas corresponden a Postgres, que requiere una base de pruebas independiente. Se usaron las dependencias existentes en el entorno local, sin incluir ese entorno en el ZIP.
- Arranque del programa documentado `tests/servidor_piloto.py`, generación de sus resultados simulados en español e inglés y comprobación de la página y del listado de productos: respuestas correctas. Se comprobó la creación de la aplicación sin mantener un servidor escuchando ni realizar una revisión visual del navegador.
- Durante las pruebas se retiraron del entorno las configuraciones de API y bases de datos y se bloquearon las conexiones a servicios externos. No se consumió la API real ni se conectó una base de datos remota.
- Revisión de los archivos mediante patrones de claves privadas, tokens de proveedores, credenciales en conexiones y asignaciones de secretos; comparación con los valores privados de los archivos de configuración originales, sin mostrarlos ni copiarlos; y revisión de cadenas literales de alta entropía. Se revisaron también el texto y los metadatos de los PDF y el contenido XML de los DOCX incluidos. **No se detectaron secretos ni coincidencias con esos valores privados.**
- El ZIP se comprueba por integridad, nombres de archivo y coincidencia de los contenidos con la copia preparada. Se verifica de nuevo que los archivos originales seleccionados mantienen sus huellas iniciales.

Al finalizar las pruebas apareció un aviso de cierre de consola de la biblioteca `pyreadline3` en Windows. El proceso terminó con código de éxito y las pruebas no fallaron.

## Qué queda por comprobar

No se ha realizado una instalación desde cero en el ordenador de Dani. `requirements.txt` contiene rangos de versiones y una instalación nueva puede descargar versiones distintas. La guía incluye pasos de instalación y un mensaje para que Claude ayude a resolver cualquier incompatibilidad con el sistema de Dani.

No se ha comprobado la API real de Claude, la disponibilidad del modelo configurado, los precios estimados del código, una base de datos Postgres externa, el alojamiento ni el funcionamiento en Mac o Linux. La demo funciona con respuestas simuladas. La precisión regulatoria y el uso con documentación real requieren las comprobaciones y la revisión experta indicadas en la referencia técnica.

Los datos y cuentas de servicios externos no se transfieren con el ZIP. Esta entrega permite continuar el código y probar el modo simulado local.
