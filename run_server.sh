#!/bin/sh

#Get path of directory where script resides
prg=$0
if [ ! -e "$prg" ]; then
  case $prg in
    (*/*) exit 1;;
    (*) prg=$(command -v -- "$prg") || exit;;
  esac
fi
dir=$(
  cd -P -- "$(dirname -- "$prg")" && pwd -P
) || exit
prg=$dir/$(basename -- "$prg") || exit

#Include this directory in python path for package
export PYTHONPATH="$PYTHONPATH:$dir"

#Source env from python virtual env
source "$dir/venv/bin/activate"

uvicorn --host 0.0.0.0 --port 9060  web:RaagApp