from fastapi import FastAPI

app = FastAPI(
    title="Python Service API",
    description="Reservado para automatizaciones de red (Netmiko/Cisco) y análisis de datos en módulos futuros.",
    version="1.0.0",
)


@app.get("/health", summary="Estado del servicio", tags=["Health"])
def health():
    return {"status": "ok", "service": "python-service"}


@app.get("/hello", summary="Endpoint de saludo de ejemplo", tags=["Hello"])
def hello():
    return {"message": "Hola mundo!!"}
