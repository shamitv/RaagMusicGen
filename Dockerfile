FROM python:3.12
LABEL authors="shamit"

WORKDIR /raag_gen
# copy python project files from local to image working directory
copy . .
RUN pip3 install -r ./setup/requirements.txt
ENTRYPOINT ["/raag_gen/run_server.sh"]
EXPOSE 9060