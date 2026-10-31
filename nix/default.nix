{
  pkgs,
  lib,
  config,
  ...
}:
let
  cfg = config.services.parkfuchs;
  stateDir = "pocktetbase-db";
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
        example = "0.36.0";
        description = ''
          Tag of the docker.io/spectado/pocketbase container image.
          The image is pulled whenever the service starts.
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
        image = "docker.io/spectado/pocketbase:${cfg.pocketBaseImageTag}";
        ports = [ "${cfg.pocketBaseAddr}:${toString cfg.pocketBasePort}:80" ];
        volumes = [
          "/var/lib/${stateDir}:/pb_data"
          "${cfg.package}/pb_migrations:/pb_migrations:ro"
        ];
        extraOptions = [ "--pull=always" ];
      };
    };

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
