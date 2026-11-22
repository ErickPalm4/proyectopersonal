# Gestor de Deudas Familiares (Prototipo Web)

Prototipo web interactivo para organizar y controlar deudas del hogar, basado en el análisis de situación real de Ingeniería de Software (UNEMI)[cite: 1, 2].

## Archivos del proyecto
- `index.html`: Estructura de la interfaz principal y formularios.
- `style.css`: Estilos visuales simples y adaptables.
- `app.js`: Lógica interactiva para deudas, cálculos, IA, informes y guardado local.

## Funcionalidades principales
- **Resumen financiero:** Muestra deuda total, tiempo estimado de pago y estrategia (*Método Avalancha* o *Bola de Nieve*)[cite: 5, 7].
- **Gestión de deudas:** Permite añadir nuevas deudas, registrar abonos y eliminar cuentas con prioridad[cite: 5].
- **Ingresos fijos o variables:** Ajusta el cálculo mensual según el tipo de ingreso[cite: 4, 6].
- **Asistente IA e informes:** Genera recomendaciones de prioridad y un reporte mensual imprimible o guardable en PDF[cite: 5, 9].
- **Privacidad local:** Guarda los datos en el navegador (`localStorage`) sin enviarlos a servidores externos[cite: 4, 6].
