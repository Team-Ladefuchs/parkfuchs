{ self, nixpkgs }: { pkgs, lib, config, unstable, ... }:
let
  cfg = config.services.parkfuchs;
  stateDir = "pocktetbase-db";
in
{
  options = with lib; {
    services.parkfuchs = {
      enable = lib.mkEnableOption "parkfuchs";
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
        default = "0.0.0.0";
        description = ''
          	Pokcetbase Addr to use.
        '';
      };

    };
  };

  config =
    lib.mkIf cfg.enable
      {
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
            ExecStart = "${unstable.legacyPackages.${system}.pocketbase}/bin/pocketbase serve --http='${cfg.pocketBaseAddr}:${toString cfg.pocketBasePort}' --dir=/var/lib/${stateDir}";
          };
        };

        systemd.services.parkfuchs = {
          enable = true;
          description = "Parkfuchs Web App";
          wantedBy = [ "multi-user.target" "pocketbase.service" ];
          environment = {
            ADDR = cfg.addr;
            PORT = toString cfg.port;
            TOMTOM_KEY = cfg.tomtomKey;
            DB_HOST = "http://127.0.0.1:${toString cfg.pocketBasePort}";
          };
          serviceConfig = {
            Type = "simple";
            User = "parkfuchs";
            Group = "parkfuchs";
            ExecStart = "${pkgs.nodejs_20}/bin/node ${self.packages.${pkgs.system}.parkfuchs}/server.js ";
          };
        };
      };
}

