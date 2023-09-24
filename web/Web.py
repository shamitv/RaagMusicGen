from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from Raag import Malkauns
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://placeholder_for_domain_name.com",
    "https://placeholder_for_domain_name.com",
    "http://localhost:8000",
    "http://localhost:5174",
]

RaagApp = FastAPI()

RaagApp.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RaagApp.mount("/ui", StaticFiles(directory="./ui_src/dist/", html=True), name="ui")


@RaagApp.get("/api1")
def root_hello():
    return {"Hello": "World"}


@RaagApp.get("/malkauns")
def root_hello():
    xml, notes, note_weights = Malkauns().getTune()
    return {"xml": xml ,"notes" : notes , "note_weights":note_weights}
