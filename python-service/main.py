from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok", "service": "python-service"}

@app.get("/hello")
def hello():
    return {"message": "Hola mundo!!"}