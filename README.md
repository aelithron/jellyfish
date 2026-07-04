# Jellyfish ![IMG](https://hackatime-badge.hackclub.com/U08RJ1PEM7X/jellyfish)

"Fish up" pieces of media from your Jellyfin library! \
This project was made for Hack Club [Entropy](https://entropy.hackclub.com)!

<a href="https://notbyai.fyi" target="_blank">
  <img src="public/not-by-ai.svg" alt="Developed by a human, not by AI!">
</a>

## Usage
To use Jellyfish, just open [jellyfish.novatea.dev](https://jellyfish.novatea.dev) in your web browser! \
You will need to sign in to a Jellyfin server to use Jellyfish. For demo purposes, you can use `https://demo.jellyfin.org/stable` as the server address, and `demo` as the username. Leave the password blank if you use this demo server!
### Self-hosting
I heavily suggest using Docker to self-host Jellyfish!
#### With Docker Compose
Copy the following Compose file to your server or computer, naming it `compose.yml`:
```yaml
services:
  jellyfish:
    image: ghcr.io/aelithron/jellyfish:latest
    container_name: jellyfish
    ports:
      - "3000:3000"
    restart: unless-stopped
```
Then, simply run `docker compose up -d` in the directory of the file!
#### With `docker run`
Run the following command on your server or computer:
```bash
docker run -d \
  --name jellyfish \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/aelithron/jellyfish:latest
```