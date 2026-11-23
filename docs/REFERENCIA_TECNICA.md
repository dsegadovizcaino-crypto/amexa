# Analizador regulatorio de software sanitario

## Piloto con expertas RA

Implementado localmente: análisis con Claude y verificación literal de citas, ES/EN y revisión mediante enlaces individuales sin cuenta. **La validación con Claude real y Postgres está pendiente de configurar las credenciales.** Las pruebas automáticas usan respuestas simuladas; no demuestran precisión regulatoria.

1. Copia `.env.example` a `.env`, configura `ANTHROPIC_API_KEY` y reinicia la app.
2. Para documentación de clientes, configura `DATABASE_URL` de Postgres/pgvector en la UE (incluye `sslmode=require`) y ejecuta `supabase/esquema.sql`. Solo después de verificar la región real configura `ANALIZADOR_REGION_BD` (por ejemplo `eu-central-1`).
3. Confirma con Anthropic que **esa organización** tiene retención cero y usa un modelo compatible; entonces configura `ANALIZADOR_ZDR_CONFIRMADO=1`. No hay un parámetro que active este acuerdo. Sin estas condiciones, los documentos de clientes quedan bloqueados. Los tres productos ficticios pueden probarse sin esta infraestructura.
4. Ejecuta `.venv/Scripts/python -m analizador ejecutar datos_prueba --todas --idioma en`. Comprueba los tres resultados con las expertas antes de dar por validado el piloto.
5. Ejecuta `.venv/Scripts/python -m analizador web`. Selecciona Español/English antes del análisis. Cada idioma tiene su propia caché, resultado y exportaciones; al cambiar de idioma se carga su análisis si existe o se permite generarlo. Las citas siempre mantienen el idioma original.
6. En **Piloto y revisión**, crea un enlace para cada revisora, indicando nombre y caducidad. Copia el enlace y compártelo por tu canal habitual. No se envían mensajes automáticamente. El enlace permite revisar solo ese snapshot del análisis, aunque posteriormente vuelvas a analizar el producto.
7. En su enlace, la supervisora revisa las filas y abre **Clase de riesgo y pruebas de cierre** para confirmar la clase o corregirla con un motivo. En **Piloto y revisión → Descargar informe revisado** puedes bajar el Word con el resumen y el Excel con el detalle. Las filas rechazadas y las que aún no ha revisado aparecen como pendientes.
8. En **Plan de pendientes**, asigna un responsable, indica qué debe demostrar el entregable y adjunta el PDF o DOCX que te envíe el cliente. La supervisora descarga la prueba desde el mismo enlace y decide si puede cerrar el pendiente. Un cambio del plan o una prueba nueva requiere volver a revisarlo. Usa archivos ficticios en la demo.

### Alojar los enlaces de revisión

El piloto usa un panel privado para el operador y un enlace HTTPS para la supervisora. Ambos procesos comparten el Postgres del piloto en la UE. Se puede usar el panel desde el equipo del operador o ejecutarlo en un servidor con disco persistente y entrar por SSH.

1. Aplica `supabase/esquema.sql` en el Postgres del piloto. En el entorno del operador configura `DATABASE_URL` con TLS, `ANALIZADOR_REGION_BD`, la credencial de Claude, la confirmación de retención cero y `ANALIZADOR_URL_REVISION` con el dominio HTTPS de revisión. Si alojas el operador, crea una carpeta privada en el disco persistente y configura su ruta absoluta en `ANALIZADOR_DATOS`.
2. Antes de iniciar ambos procesos en el servidor, instala `requirements-produccion.txt` en el entorno virtual. Ejecuta `python -m analizador comprobar-produccion` con el entorno del operador. Comprueba el esquema de Postgres y el acceso al modelo de Claude sin analizar archivos.
3. Inicia estos procesos desde el directorio del código con los ejecutables del entorno virtual. El proceso de revisión solo necesita `DATABASE_URL` y `ANALIZADOR_REGION_BD`. El operador usa una única instancia para conservar el seguimiento de los análisis activos.

   ```sh
   waitress-serve --listen=127.0.0.1:8765 --max-request-body-size=314572800 --call analizador.produccion:crear_operador
   waitress-serve --listen=127.0.0.1:8766 --max-request-body-size=65536 analizador.wsgi:app
   ```

4. Configura el proxy HTTPS del dominio de revisión para enviar peticiones solo a `127.0.0.1:8766`. Accede al panel privado desde tu equipo con `ssh -N -L 127.0.0.1:8765:127.0.0.1:8765 operador@servidor` y abre `http://127.0.0.1:8765`.
5. Comprueba que `/api/revision/sesion` devuelve 401 sin token y que `/api/productos` devuelve 404 en el dominio HTTPS. Crea un enlace desde el panel y completa una revisión con documentación ficticia antes de invitar a la supervisora.

Para desarrollo, `.venv/Scripts/python -m analizador web --solo-revision --puerto 8766 --no-abrir` sirve solo la revisión. `--host 0.0.0.0` solo se admite con `--solo-revision`; el servidor de desarrollo no sustituye el despliegue WSGI con HTTPS.

### Qué se guarda y cómo se mide

- `resultado.json`: `analysis_id`, idioma, las 118 filas, origen de evidencias (`doc`, `pagina`, `cita_textual`, `fragmento_id`, `verificada`), tiempo y coste estimado. En inglés se guarda en `salida/<producto>/en/`.
- `consumo.jsonl`: registro por llamada (modelo realmente usado, tokens de entrada/salida y caché, tarifas y coste estimado), más resúmenes de cada ejecución, incluidas las fallidas. Los totales por análisis acumulan sus reanudaciones. Son estimaciones según tarifas registradas, no importes facturados. No registra prompts ni citas.
- `revision`: decisión, estado/texto corregidos, comentario, tiempo activo y fecha por fila y sesión. Los tokens se generan con 256 bits de entropía y solo se almacena su hash. Pueden caducar y revocarse.
- El reloj cuenta una fila abierta cada vez, pausa con pestaña oculta o sin foco y tras 60 segundos sin actividad. Los pulsos son idempotentes y el servidor limita el tiempo al realmente transcurrido. Es una medición de interacción del navegador, no una prueba de atención humana.
- Al terminar todas las filas se exige la estimación de horas manuales. El panel muestra aceptadas sin cambios, corregidas y rechazadas sobre **filas ya revisadas**, pendientes, tiempo activo, ahorro estimado y desglose por **confianza original**. Cada revisora conserva su propio denominador y decisiones.
- SQLite sirve para pruebas locales y crea automáticamente las tablas de seguimiento. Para un piloto alojado, vuelve a ejecutar `supabase/esquema.sql` en el Postgres de la UE para añadirlas. El esquema activa RLS sin políticas públicas. Las pruebas de cierre se guardan en esa misma base y se descargan desde el enlace de revisión de su sesión.

La base bilingüe usa `02017R0745-20260719`, obtenida en los dos idiomas de EUR-Lex/Oficina de Publicaciones. El constructor comprueba que los 118 identificadores coincidan en orden. Fuentes: [ES](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02017R0745-20260719), [EN](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02017R0745-20260719). La propuesta de reforma se conserva únicamente como información separada.

Las citas se cotejan literalmente (solo se normaliza maquetación). Una cita inválida se elimina, añade aviso y baja la confianza; sin evidencia válida un «cubierto/parcial» pasa a «falta». Si una etapa no se pudo evaluar, el análisis se marca incompleto y no puede enviarse a revisión.

Para verificar la interfaz sin coste: `.venv/Scripts/python tests/servidor_piloto.py` (puerto 8767, resultados **simulados** ES/EN). Pruebas: `.venv/Scripts/python -m pytest tests -q`. Postgres requiere `TEST_DATABASE_URL`; no se crea una base remota automáticamente.

Recibe la documentación técnica de un producto y genera un borrador con:

- **Ficha del producto**: finalidad, usuarios, pacientes, entorno, IA, datos y contradicciones entre documentos.
- **Clasificación preliminar** según la Regla 11 del MDR y la guía MDCG 2019-11, argumentada y con citas.
- **Matriz GSPR** de las 118 filas del Anexo I: si aplica y por qué, normas relacionadas, evidencia (documento, página y cita) y estado.
- **Lista de carencias** ordenada por prioridad.

Salida: un `.xlsx` editable con la matriz y la hoja de medición, y un `.docx` con el informe de diagnóstico. Todo es un borrador para que lo revise un experto.

## Puesta en marcha

Crea el archivo `.env` y pon en él tu clave de la API:

```bash
cp .env.example .env
```

Si partes de una copia nueva del proyecto, instala antes las dependencias:

```bash
python -m venv .venv
```

```bash
.venv/Scripts/python -m pip install -r requirements.txt
```

La primera ejecución descarga el modelo local de embeddings (unos minutos).

## Probarlo desde el navegador

La forma más sencilla es la página local. Solo funciona en tu ordenador (`127.0.0.1`) y se abre sola:

```bash
.venv/Scripts/python -m analizador web
```

Desde ella puedes subir documentos arrastrándolos o elegir un producto de prueba, pulsar «Analizar» y seguir el avance por etapas. Al terminar ves la clase, la matriz con filtros, las carencias y la ficha, y descargas el Excel y el Word. En los productos de prueba, la pestaña «Comprobación» indica qué ha detectado de lo sembrado.

Sin clave puedes ver los documentos y un ejemplo con datos de relleno, marcado como simulado. Para regenerar ese ejemplo:

```bash
.venv/Scripts/python herramientas/generar_ejemplo_simulado.py
```

Para revisar la interfaz sin gastar, este servidor usa un Claude simulado y guarda todo en una carpeta temporal:

```bash
.venv/Scripts/python tests/servidor_simulado.py
```

## Demo pública en Vercel

### Piloto interactivo para compartir

Incluye InsuPauta, LunarCheck y TriaUrg en español e inglés. En **Piloto y revisión → Probar como supervisora** puedes corregir filas, confirmar la clase y revisar pruebas ficticias. Las decisiones y las métricas viven en la pestaña y se borran al recargar. El Word y el Excel revisados son ejemplos preparados.

Desde PowerShell, genera el paquete en una carpeta vacía fuera del repositorio y enlázalo al proyecto de Vercel.

```powershell
.\.venv\Scripts\python.exe herramientas\exportar_demo.py --piloto 'C:\Users\Public\piloto-regulatorio-compartir'
Set-Location 'C:\Users\Public\piloto-regulatorio-compartir'
vercel link --project analizador-regulatorio --scope brunomarconis-projects --yes
vercel deploy --prod
```

Tras publicar, abre el dominio de producción en incógnito y prueba una decisión antes de compartir el enlace. El paquete contiene solo archivos estáticos con datos ficticios.

### Demo de solo lectura

Publicada en <https://analizador-regulatorio.vercel.app>. Es de solo lectura: enseña el ejemplo simulado y no permite subir ni analizar nada. No se indexa en buscadores.

La app completa no puede ir a Vercel tal cual: el análisis tarda muchos minutos en segundo plano, guarda archivos en disco y no tiene login, así que cualquiera podría subir documentos y gastar tu saldo.

Para actualizar la demo, genera la versión estática en una carpeta que esté fuera de cualquier repositorio git, porque tu carpeta de usuario también es uno. Así Vercel no intenta conectar el proyecto con ese repositorio:

```bash
.venv/Scripts/python herramientas/exportar_demo.py C:/Users/Public/analizador-regulatorio
```

Y publícala desde esa carpeta:

```bash
cd C:/Users/Public/analizador-regulatorio && vercel deploy --prod --yes
```

## Uso por comandos

Deja los PDF y DOCX de un producto en `entrada/<producto>/` y lanza:

```bash
.venv/Scripts/python -m analizador ejecutar entrada/mi_producto
```

El resultado queda en `salida/mi_producto/`. Si una ejecución falla a medias, relánzala: sigue donde se quedó y no repite lo ya pagado. `--desde-cero` lo rehace todo.

Solo extraer el texto, sin llamar a la API ni gastar:

```bash
.venv/Scripts/python -m analizador recoger entrada/mi_producto
```

Analizar los 3 productos ficticios:

```bash
.venv/Scripts/python -m analizador ejecutar datos_prueba --todas
```

Comparar los resultados con lo sembrado a propósito en esos productos. Sirve para detectar regresiones, no sustituye al experto:

```bash
.venv/Scripts/python -m analizador evaluar
```

## Cómo se mide el MVP

La hoja **Medición** del Excel calcula los dos criterios de aceptación. El experto anota las horas que tardaría a mano y las que ha tardado revisando, y marca cada fila de la matriz como `Aceptada`, `Retoque menor` o `Reescrita`.

- Ahorro de tiempo: objetivo de al menos un 50 %.
- Filas aceptadas sin reescribir a fondo: objetivo de al menos un 80 %.

## Decisiones de diseño

- **Las citas se comprueban con código.** Claude devuelve el id del fragmento y una cita literal. Se descartan citas aproximadas, cifras cambiadas o texto añadido, y baja la confianza. Una fila «cubierta» o «parcial» sin citas verificables pasa a «falta».
- **Las normas no las elige Claude.** Salen de una tabla fija (`kb/normas.json`) con títulos y apartados, nunca con texto de las normas. Es un primer borrador: **el experto debe validarla**.
- **Ninguna fila se pierde.** Si Claude omite una fila, se vuelve a pedir; si falla, queda como «sin evaluar». Las filas abiertas que no entran en ninguna carencia se añaden solas a la lista.
- **Los documentos son datos, no órdenes.** Se delimitan para que no puedan salir de sus etiquetas, y cualquier texto dirigido a una IA se señala en las alertas.
- **Embeddings en local.** El texto del cliente no pasa por un servicio de embeddings de terceros.
- **Contexto.** Ficha y clasificación pueden usar el contexto completo hasta 400.000 caracteres. La matriz siempre recupera fragmentos por requisito y agrupa por sección, con caché para la ficha y el contexto normativo.
- **Modelo explícito.** Se eliminó el fallback automático a otros modelos para mantener la selección de modelo y las condiciones de retención bajo control.
- **Solo se usa la API de mensajes.** Las Batches y la Files API no tienen retención cero, así que no se usan.

## Protección de datos: pendiente antes del primer cliente real

Los datos de prueba son inventados, así que esto no bloquea el MVP, pero sí el primer cliente.

- **Retención cero.** No es un parámetro de la API. Se contrata por organización con el equipo de ventas de Anthropic. Hasta entonces se aplica la retención estándar. Los modelos Fable no están disponibles con retención cero.
- **Residencia en la UE.** Supabase puede alojarse en la UE, pero la API de Claude solo ofrece inferencia `us` o `global`, y almacenamiento en `us`. Para procesar en la UE habría que estudiar Amazon Bedrock o Google Vertex en región europea. Hay que confirmar antes que el modelo esté disponible allí, y esas plataformas no admiten el parámetro `fallbacks`.

## Base de conocimiento

`kb/` se genera desde los textos públicos de `kb/fuentes/`: MDR consolidado en español (EUR-Lex), MDCG 2019-11 rev.1, 2019-16 rev.1 y 2020-1, y la propuesta de reforma COM(2025) 1023. Esa propuesta se usa solo para una nota informativa: no influye en la clase propuesta.

El MDR se actualiza varias veces al año. Antes de cada lote de análisis:

```bash
.venv/Scripts/python herramientas/comprobar_version_mdr.py
```

Tras cambiar una fuente:

```bash
.venv/Scripts/python herramientas/construir_kb.py
```

## Supabase

Sin configurar nada, el índice se guarda en local. Para usar Supabase:

1. Crea un proyecto en una región de la UE.
2. Ejecuta `supabase/esquema.sql` en el SQL Editor. Activa RLS sin políticas, de modo que la API pública no pueda leer estas tablas.
3. Pon la cadena de conexión en `DATABASE_URL`, dentro de `.env`.

## Datos de prueba

Tres productos ficticios en `datos_prueba/`, con carencias sembradas descritas en cada `esperado.json`: LunarCheck (lunares), InsuPauta (dosis de insulina) y TriaUrg (triaje en urgencias). Para regenerarlos desde `herramientas/fuentes_prueba/`:

```bash
.venv/Scripts/python herramientas/generar_datos_prueba.py
```

## Tests

```bash
.venv/Scripts/python -m pytest tests
```

No llaman a la API: usan un Claude simulado y una red simulada. La prueba de Postgres solo se ejecuta si defines `TEST_DATABASE_URL`.

## Limitaciones conocidas

- Los PDF escaneados no se leen (no hay OCR): se avisa de las páginas afectadas.
- Un DOCX solo da número de página si Word guardó la paginación; si no, la cita indica la sección.
- Las imágenes y los diagramas de los documentos no se analizan.
