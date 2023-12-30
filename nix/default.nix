{ self, nixpkgs }: { pkgs, lib, config, ... }:
let
  cfg = config.services.parkfuchs;
in
{
  options = with lib; {
    services.parkfuchs = {
      enable = lib.mkEnableOption "parkfuchs";
      addr = lib.mkOption {
        type = types.str;
        default = "0.0.0.0";
        description = ''
          Addr to run shutdown-thing on.
        '';
      };
      port = lib.mkOption {
        type = types.port;
        default = 3000;
        description = ''
          Port to run shutdown-thing on.
        '';
      };
    };
  };
  config = lib.mkIf (cfg.enable) {
    systemd.services.parkfuchs = {
      enable = true;
      description = "Parkfuchs Web App";
      wantedBy = [ "multi-user.target" ];
      environment = {
        ADDR = cfg.addr;
        PORT = toString cfg.port;
      };
      serviceConfig = {
        Type = "simple";
        User = "parkfuchs";
        Group = "parkfuchs";
        ExecStart = "${pkgs.nodejs_20}/bin/node ${self.packages.${pkgs.system}.parkfuchs}/server.js";
      };
    };
  };
}

