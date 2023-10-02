from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from Raag import Malkauns
from fastapi.middleware.cors import CORSMiddleware

from web.RaagImpl.RaagGen import RaagGen

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

Raag = RaagGen()


@RaagApp.get("/api1")
def root_hello():
    return {"Hello": "World"}


@RaagApp.get("/malkauns")
def malkauns():
    xml, notes, note_weights = Malkauns().getTune('D')
    return {"xml": xml, "notes": notes, "note_weights": note_weights}


@RaagApp.get("/GenerateTune/Raag/{raag_id}/Instrument/{instrument_id}")
def generate_tune(raag_id: int, instrument_id: int):
    xml, notes, note_weights = Raag.get_tune(raag_id, instrument_id)
    return {"xml": xml, "notes": notes, "note_weights": note_weights}
