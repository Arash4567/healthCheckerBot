#/bin/bash
echo "Building image.."
docker build . -t healtchecker
echo "Running docker container..."
docker compose down
docker compose up
echo "All done!"
