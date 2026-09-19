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

      pocketBasePort = lib.mkOption {
        type = types.port;
        default = 8090;
        description = ''
          	Pokcetbase Host Port.
        '';
      };

      pocketBaseAddr = lib.mkOption {
        type = types.str;
        default = "127.0.0.1";
        description = ''
          	Pokcetbase Addr to use.
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

    systemd.services.pocketbase = {
      enable = true;
      description = "Pocketbase: Open Source backend";
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        Type = "simple";
        User = "parkfuchs";
        LimitNOFILE = "4096";
        Restart = "always";
        RestartSec = "5s";
        Group = "parkfuchs";
        StateDirectory = stateDir;
        # Starts the web server (default to 127.0.0.1:8090 if no domain is specified)
        ExecStart = "${pkgs.pocketbase}/bin/pocketbase serve --http='${cfg.pocketBaseAddr}:${toString cfg.pocketBasePort}' --dir=/var/lib/${stateDir} --migrationsDir='${cfg.package}/pb_migrations'";
      };
    };

    systemd.services.parkfuchs = {
      enable = true;
      description = "Parkfuchs Web App";
      wantedBy = [
        "multi-user.target"
        "pocketbase.service"
      ];
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
