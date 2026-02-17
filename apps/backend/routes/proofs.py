# Signed URL 발급 코드 서버 경유 발급
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
import os

router = APIRouter()
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

class SignedUrlReq(BaseModel):
    path: str
    ttl: int = 600
    user_id: str

@router.post("/signed-url")
def create_signed_url(req: SignedUrlReq):
    # (중요) req.user_id와 req.path의 첫 폴더가 일치하는지 검증해 주세요.
    first_folder = req.path.split("/", 1)[0]
    if first_folder != req.user_id:
        raise HTTPException(status_code=403, detail="path not owned by user")

    res = sb.storage.from_("proofs").create_signed_url(req.path, req.ttl)
    if res.get("error"):
        raise HTTPException(status_code=400, detail=res["error"]["message"])
    return res
