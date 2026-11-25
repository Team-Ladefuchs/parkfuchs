{
  pkgs,
  lib,
  config,
  ...
}:
let
  cfg = config.services.parkfuchs;
  stateDir = "pocktetbase-db";
  podman = "${config.virtualisation.podman.package}/bin/podman";
  image = "localhost/parkfuchs-pocketbase:${cfg.pocketBaseImageTag}";
  context = builtins.path {
    path = ../containers/pocketbase;
    name = "parkfuchs-pocketbase-container";
  };
in
{
  options = with lib; {
    services.parkfuchs = {
      enable = lib.mkEnableOption "parkfuchs";
      package = lib.mkOption {
        type = types.package;
        description = ''
          The parkfuchs web app package to run.
        '';
      };

      addr = lib.mkOption {
        type = types.str;
        default = "127.0.0.1";
        description = ''
          Addr to run parkfuchs on.
        '';
      };

      port = lib.mkOption {
        type = types.port;
        default = 3000;
        description = ''
          Port to run parkfuchs on.
        '';
      };

      tomtomKey = lib.mkOption {
        type = types.str;
        default = "";
        description = ''
          TOMTOM API key to run parkfuchs on.

          Prefer `tomtomKeyFile`: a key set here is copied into the
          world-readable Nix store.
        '';
      };

      tomtomKeyFile = lib.mkOption {
        type = types.nullOr types.str;
        default = null;
        description = ''
          Path to a root-owned systemd EnvironmentFile containing
          `TOMTOM_KEY=...`. Takes precedence over `tomtomKey`.
        '';
      };

      pocketBaseImageTag = lib.mkOption {
        type = types.str;
        default = "latest";
        example = "0.41.1";
        description = ''
          Official PocketBase release version, without the leading v, or latest.
          A local container image is built from the official release binary.
          A pinned version is built once and reused across restarts; latest is
          rebuilt on every service start.
        '';
      };

      pocketBasePort = lib.mkOption {
        type = types.port;
        default = 8090;
        description = ''
          PocketBase host port.
        '';
      };

      pocketBaseAddr = lib.mkOption {
        type = types.str;
        default = "127.0.0.1";
        description = ''
          Host address on which to expose PocketBase.
        '';
      };

    };
  };

  config = lib.mkIf cfg.enable {
    users.users.parkfuchs = {
      isSystemUser = true;
      group = "parkfuchs";
    };
    users.groups.parkfuchs = { };

    virtualisation.oci-containers = {
      backend = "podman";
      containers.pocketbase = {
        inherit image;
        ports = [ "${cfg.pocketBaseAddr}:${toString cfg.pocketBasePort}:8080" ];
        volumes = [
          "/var/lib/${stateDir}:/pb_data"
          "${cfg.package}/pb_migrations:/pb_migrations:ro"
        ];
        pull = "never";
      };
    };

    # A pinned version is built only when no image exists for it and the current
    # build context; `latest` is rebuilt on every start to pick up new releases.
    systemd.services.podman-pocketbase.preStart = lib.mkBefore ''
      current=$(${podman} image inspect --format '{{ index .Labels "parkfuchs.context" }}' ${lib.escapeShellArg image} 2>/dev/null || true)
      if [ ${lib.escapeShellArg cfg.pocketBaseImageTag} = latest ] || [ "$current" != ${lib.escapeShellArg "${context}"} ]; then
        ${podman} build --pull=always ${lib.optionalString (cfg.pocketBaseImageTag == "latest") "--no-cache"} \
          --build-arg ${lib.escapeShellArg "PB_VERSION=${cfg.pocketBaseImageTag}"} \
          --label ${lib.escapeShellArg "parkfuchs.context=${context}"} \
          --tag ${lib.escapeShellArg image} \
          ${context}
      fi
    '';

    # Keep the existing path (including its spelling) to retain deployed data.
    systemd.tmpfiles.rules = [ "d /var/lib/${stateDir} 0750 parkfuchs parkfuchs -" ];

    systemd.services.parkfuchs = {
      enable = true;
      description = "Parkfuchs Web App";
      wantedBy = [ "multi-user.target" ];
      requires = [ "podman-pocketbase.service" ];
      after = [ "podman-pocketbase.service" ];
      environment = {
        NITRO_HOST = cfg.addr;
        PORT = toString cfg.port;
        DB_PORT = toString cfg.pocketBasePort;
      } // lib.optionalAttrs (cfg.tomtomKeyFile == null && cfg.tomtomKey != "") {
        TOMTOM_KEY = cfg.tomtomKey;
      };
      serviceConfig = {
        Type = "simple";
        User = "parkfuchs";
        Group = "parkfuchs";
        ExecStart = "${pkgs.bun}/bin/bun ${cfg.package}/server/index.mjs";
      } // lib.optionalAttrs (cfg.tomtomKeyFile != null) {
        EnvironmentFile = cfg.tomtomKeyFile;
      };
    };
  };
}
