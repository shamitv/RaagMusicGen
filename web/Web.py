from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

RaagApp = FastAPI()

RaagApp.mount("/ui", StaticFiles(directory="./ui_src/dist/", html=True), name="ui")


@RaagApp.get("/api1")
def root_hello():
    return {"Hello": "World"}
