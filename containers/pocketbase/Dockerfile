FROM docker.io/library/alpine:latest

ARG PB_VERSION=latest
RUN apk add --no-cache ca-certificates curl jq unzip \
    && version="$PB_VERSION" \
    && if [ "$version" = latest ]; then \
         version="$(curl -fsSL --get https://ganigeorgiev.com/api/collections/releases/records \
           --data-urlencode 'perPage=1' --data-urlencode 'sort=-semver' \
           --data-urlencode 'filter=channel.repository.name="pocketbase" && channel.repository.project.name="pocketbase" && channel.name="default" && draft=false' \
           | jq -er '.items[0].tag | select(type == "string" and startswith("v")) | ltrimstr("v")')"; \
       fi \
    && case "$(uname -m)" in \
         x86_64) arch=amd64 ;; \
         aarch64) arch=arm64 ;; \
         *) echo 'Unsupported architecture' >&2; exit 1 ;; \
       esac \
    && archive="pocketbase_${version}_linux_${arch}.zip" \
    && source="https://ganigeorgiev.com/meta/pocketbase/pocketbase/download/v${version}" \
    && cd /tmp \
    && curl -fsSL "$source/$archive" -o "$archive" \
    && curl -fsSL "$source/checksums.txt" -o checksums.txt \
    && awk -v archive="$archive" '$2 == archive { print; found=1 } END { if (!found) exit 1 }' checksums.txt > selected-checksum.txt \
    && sha256sum -c selected-checksum.txt \
    && unzip "$archive" pocketbase -d /pb \
    && rm "$archive" checksums.txt selected-checksum.txt

EXPOSE 8080
ENTRYPOINT ["/pb/pocketbase"]
CMD ["serve", "--http=0.0.0.0:8080", "--dir=/pb_data", "--migrationsDir=/pb_migrations"]
