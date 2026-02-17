from fastapi import FastAPI
from routes.proofs import router as proofs_router # (나중에 서버경유 발급 쓸 때)

app = FastAPI()
app.include_router(proofs_router, prefix="/proofs", tags=["proofs"])

@app.get("/health")
async def health():
    return {"status": "ok"}

# app.include_router(proofs_router, prefix="/proofs", tags=["proofs"])