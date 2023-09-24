from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from Raag import Malkauns

RaagApp = FastAPI()

RaagApp.mount("/ui", StaticFiles(directory="./ui_src/dist/", html=True), name="ui")


@RaagApp.get("/api1")
def root_hello():
    return {"Hello": "World"}


@RaagApp.get("/malkauns")
def root_hello():
    xml, notes, note_weights = Malkauns().getTune()
    return {"xml": xml ,"notes" : notes , "note_weights":note_weights}
