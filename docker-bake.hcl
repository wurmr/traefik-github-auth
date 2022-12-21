variable "TAG" {
  default = "dev"
}

target "default" {
    dockerfile = "Dockerfile"
    tags = ["wurmr/traefik-github-auth:latest", "wurmr/traefik-github-auth:${TAG}"]
    platforms = ["linux/amd64", "linux/arm64"]
}