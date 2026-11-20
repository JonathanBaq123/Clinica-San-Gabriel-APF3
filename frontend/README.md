# Frontend de Clínica San Gabriel

Las instrucciones completas se encuentran en [README de la raíz](../README.md).

Desde esta carpeta:

```powershell
npm ci
npm start
```

Compilación de producción:

```powershell
npm run build
```

API configurada en `src/environments/environment.ts`: `http://localhost:8080/api`.

Arquitectura standalone con `app.config.ts`, `app.routes.ts` y componentes en `Componentes/`. Servicios REST en `Servicios/`, contratos en `modelos/` y seguridad en `core/`.
