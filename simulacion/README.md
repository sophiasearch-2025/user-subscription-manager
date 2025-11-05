# Simulación - Interfaz estática

Carpeta `simulacion` contiene una interfaz estática simple para que terceros visualicen datos de ejemplo sin interactuar con la API principal.

Archivos:

- `index.html` - página principal (abrir en navegador)
- `styles.css` - estilos
- `app.js` - lógica cliente para cargar `data/sample-data.json`
- `data/sample-data.json` - datos de ejemplo (usuarios y suscripciones)

Cómo usar:

1. Abrir localmente

   - Opción rápida: abre `simulacion/index.html` en tu navegador (arrastrar/abrir archivo). Algunos navegadores bloquean fetch de archivos locales; en ese caso usa un servidor local.

   - Servir con Python (recomendado):

     ```bash
     cd simulacion
     python3 -m http.server 8000
     # luego abrir http://localhost:8000 en el navegador
     ```

2. Filtrar por email, exportar JSON, ver usuarios y suscripciones.

Nota de seguridad: esta interfaz es completamente estática y solo usa el archivo `data/sample-data.json` proporcionado. No envía peticiones al backend ni modifica datos reales.
