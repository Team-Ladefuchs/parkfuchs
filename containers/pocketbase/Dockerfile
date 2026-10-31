FROM docker.io/library/alpine:latest

ARG PB_VERSION=latest
RUN apk add --no-cache ca-certificates curl unzip \
    && version="$PB_VERSION" \
    && if [ "$version" = latest ]; then \
         release_url="$(curl -fsSL -o /dev/null -w '%{url_effective}' https://github.com/pocketbase/pocketbase/releases/latest)"; \
         version="${release_url##*/v}"; \
       fi \
    && case "$(uname -m)" in \
         x86_64) arch=amd64 ;; \
         aarch64) arch=arm64 ;; \
         *) echo 'Unsupported architecture' >&2; exit 1 ;; \
       esac \
    && curl -fsSL "https://github.com/pocketbase/pocketbase/releases/download/v${version}/pocketbase_${version}_linux_${arch}.zip" -o /tmp/pb.zip \
    && unzip /tmp/pb.zip pocketbase -d /pb \
    && rm /tmp/pb.zip

EXPOSE 8080
ENTRYPOINT ["/pb/pocketbase"]
CMD ["serve", "--http=0.0.0.0:8080", "--dir=/pb_data", "--migrationsDir=/pb_migrations"]
