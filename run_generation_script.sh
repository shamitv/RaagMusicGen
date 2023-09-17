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

python3 "$dir/test/malkauns_tune.py"