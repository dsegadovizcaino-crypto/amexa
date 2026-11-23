# Amexa — empieza aquí, Dani

Esta carpeta contiene el código de Amexa, el analizador de documentación de software sanitario. Puedes usarla para continuar el proyecto con Claude. La aplicación prepara una ficha del producto, una clasificación preliminar, una matriz de requisitos y una lista de pendientes, con exportaciones a Word y Excel.

**Empieza por la demo simulada.** Utiliza documentos inventados y respuestas de prueba. No necesitas una clave de API ni una base de datos externa para esa primera prueba. Los resultados simulados no validan la precisión del análisis regulatorio.

## 1. Descomprime el ZIP

En Windows, pulsa el botón derecho sobre el ZIP y elige **Extraer todo**. Abre la carpeta `Amexa` extraída. Dentro deben estar este `README.md`, `requirements.txt`, `analizador` y `tests`. Trabaja siempre en esa carpeta, fuera del ZIP.

Guarda también el ZIP recibido para conservar una copia del punto de partida.

## 2. Abre el proyecto con Claude

La forma más cómoda es usar **Claude Code** desde la aplicación de escritorio de Claude, con una cuenta que tenga acceso a esa función:

1. Instala o abre Claude Desktop e inicia sesión.
2. Abre la pestaña **Code**, crea una sesión y selecciona la carpeta `Amexa` que acabas de extraer.
3. Abre `CONTINUAR_CON_CLAUDE.md` y copia su mensaje inicial en esa sesión.
4. Pídele primero que te ayude a instalar y arrancar la demo. No necesitas escribir el código tú.

[Guía oficial para empezar con Claude Code](https://support.claude.com/en/articles/14552382-your-first-day-in-claude-code).

Si ya utilizas Claude Code en una terminal, abre una terminal dentro de `Amexa`, ejecuta `claude` y pega el mismo mensaje. Una conversación normal en la web no obtiene acceso por sí sola a la carpeta de tu ordenador.

## 3. Instala lo necesario en Windows

Puedes pedir a Claude que te acompañe en estos pasos. Necesitas conexión a internet para descargar las dependencias y Python de 64 bits. Esta entrega se ha comprobado con **Python 3.10.10** y las dependencias ya instaladas en el entorno del proyecto. No se ha verificado una instalación nueva con otra versión de Python; si aún no lo tienes, pide a Claude que compruebe una versión compatible con `requirements.txt` antes de instalarla.

[Descarga oficial de Python para Windows](https://www.python.org/downloads/windows/).

Abre PowerShell dentro de la carpeta `Amexa`: en el Explorador, pulsa la barra de la ruta, escribe `powershell` y pulsa Intro. Comprueba Python:

```powershell
py --version
```

Ejecuta estas dos líneas, una cada vez. Espera a que termine cada una:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

La carpeta `.venv` se crea en tu ordenador y contiene los programas que necesita Amexa. Puede ocupar bastante espacio. No hace falta instalar Node.js para ejecutar esta aplicación.

Si `py` no se reconoce, prueba `python --version` y usa `python -m venv .venv` en la primera línea. Si aparece un error al instalar, copia el texto del error a Claude y detente antes del siguiente paso.

## 4. Arranca la demo sin gastar en la API

Para esta primera prueba, deja `.env` sin crear y no configures conexiones a bases de datos. En la misma ventana de PowerShell ejecuta:

```powershell
.\.venv\Scripts\python.exe tests\servidor_piloto.py
```

Cuando aparezca el mensaje de que el servidor está escuchando, abre esta dirección en el navegador:

**http://127.0.0.1:8767**

Deja PowerShell abierto mientras la usas. Verás el piloto con el ejemplo ficticio de LunarCheck, preparado en español e inglés. Puedes explorar la matriz, las carencias y la revisión, y descargar los ejemplos de Word y Excel. Los datos de esta sesión se guardan en una carpeta temporal; al volver a arrancar el piloto se prepara una nueva sesión.

Para detenerlo, vuelve a PowerShell y pulsa **Ctrl+C**. Para abrirlo otro día, repite solo el comando de este apartado; no necesitas volver a instalarlo todo.

Si el puerto está ocupado, usa otro:

```powershell
.\.venv\Scripts\python.exe tests\servidor_piloto.py 8777
```

En ese caso abre `http://127.0.0.1:8777`.

## 5. Cuando quieras probar el análisis real

Hazlo después de comprobar la demo con Claude. La API que usa Amexa se configura aparte de la cuenta con la que programas en Claude y puede generar gasto.

1. Copia la plantilla, sin sobrescribir un `.env` que ya hayas creado:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

2. Escribe tu propia clave en `ANTHROPIC_API_KEY` y guarda. No la pegues en una conversación ni la incluyas al volver a compartir el proyecto.
3. Comprueba con Claude que el modelo configurado en `analizador/config.py` está disponible para vuestra cuenta. El nombre de modelo y las estimaciones de precio se han conservado del código recibido; no se ha validado su acceso con una API real en esta entrega.
4. Arranca la aplicación normal:

   ```powershell
   .\.venv\Scripts\python.exe -m analizador web
   ```

5. Abre `http://127.0.0.1:8765` si el navegador no se abre solo. Para las primeras pruebas utiliza únicamente los productos ficticios incluidos. El análisis real puede descargar además el modelo local de embeddings la primera vez.

Para documentación real de clientes quedan pendientes la configuración y comprobación de la base de datos, las condiciones de privacidad y la validación experta descritas en `docs/REFERENCIA_TECNICA.md`. No cambies `ANALIZADOR_ZDR_CONFIRMADO` a `1` para saltarte esa comprobación. Los informes que genera el proyecto son borradores para revisión experta.

## Qué contiene la carpeta

| Archivo o carpeta | Para qué sirve |
| --- | --- |
| `analizador/` | Aplicación Python, página local y lógica del análisis y la revisión. |
| `datos_prueba/` | Productos y documentos ficticios para probar. |
| `tests/` | Pruebas automáticas y servidores simulados. Se necesitan para la demo. |
| `kb/` | Base de conocimiento y fuentes públicas utilizadas por el proyecto. |
| `herramientas/` | Utilidades para preparar ejemplos y la base de conocimiento. |
| `landing/` | Web de presentación de Amexa (noviembre de 2026). Se publica arrastrando la carpeta a app.netlify.com/drop. |
| `supabase/esquema.sql` | Estructura de la base de datos opcional. |
| `.env.example` | Plantilla sin claves, para configurar el modo real. |
| `docs/REFERENCIA_TECNICA.md` | README técnico original conservado como referencia; contiene también instrucciones de alojamiento que no necesitas para empezar. |
| `docs/ENTREGA.md` | Procedencia, limpieza y comprobaciones de esta entrega. |

El ZIP no incluye claves, la base de datos ni su contenido, documentos de clientes, resultados previos, accesos a servicios ni la instalación del ordenador de origen. Los enlaces de revisión y el alojamiento se configuran aparte. No se ha desplegado nada al preparar esta entrega.

## Si utilizas Mac o Linux

Desde una terminal situada en `Amexa`, los comandos equivalentes son:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python tests/servidor_piloto.py
```

Abre `http://127.0.0.1:8767`. Las comprobaciones de esta entrega se han hecho en Windows; esta ruta para Mac y Linux no se ha probado aquí.

## Comprobación técnica opcional

Claude puede ejecutar las pruebas sin consumir la API:

```powershell
.\.venv\Scripts\python.exe -m pytest tests -q
```

Las pruebas de Postgres requieren una base de pruebas separada y `TEST_DATABASE_URL`; es normal que se omitan si no está configurada. Consulta el resultado de la comprobación de esta entrega en `docs/ENTREGA.md`.
