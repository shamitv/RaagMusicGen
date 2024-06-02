![img.png](readme_assets/screenshot.png)

Demo :

https://raag.shamit-cloud.com/ui/ 

**Run an Instance**
1. Clone the repository
2. `docker build . --tag raag_gen:latest`
3. `docker run -d -p 9060:9060 --restart=unless-stopped --name raag raag_gen:latest`

**Local installation for development**:

1. Create a Python virtual environment (>= 3.10)
2. Install dependencies [requirements.txt](setup%2Frequirements.txt)
3. Start server [run_server.sh](run_server.sh)
4. Open UI in browser http://localhost:9060/ui

