{
  description = "Parkfuchs";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    {
      nixosModules = rec {
        parkfuchs =
          {
            pkgs,
            lib,
            ...
          }:
          {
            imports = [ ./nix/default.nix ];
            services.parkfuchs.package = lib.mkDefault self.packages.${pkgs.system}.parkfuchs;
          };
        default = parkfuchs;
      };
    }
    // flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        pnpm = pkgs.pnpm;
        parkfuchs = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "parkfuchs";
          version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
          src =
            let
              lib = nixpkgs.lib;
              root = toString ./.;
            in
            lib.cleanSourceWith {
              src = lib.cleanSource ./.;
              filter =
                path: _type:
                !(lib.hasPrefix "${root}/nix" path)
                && !(lib.hasPrefix "${root}/.github" path)
                && !(lib.hasPrefix "${root}/pocketbase-db" path)
                && !(lib.hasPrefix "${root}/node_modules" path)
                && !(lib.hasPrefix "${root}/.output" path)
                && !lib.elem (baseNameOf path) [
                  "flake.nix"
                  "flake.lock"
                  "README.md"
                ];
            };
          nativeBuildInputs = [
            pkgs.nodejs_24
            pnpm
            pkgs.pnpmConfigHook
          ];
          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (finalAttrs) pname src;
            inherit pnpm;
            fetcherVersion = 4;
            hash = "sha256-Y1pF0QPX88ZcXbbqx829rxq6JdO+jae79bW+SOk0pv4=";
          };
          buildPhase = ''
            runHook preBuild
            pnpm run build
            runHook postBuild
          '';
          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r .output/. $out/
            cp -r pb_migrations $out/pb_migrations
            runHook postInstall
          '';
        });
      in
      {
        defaultPackage = parkfuchs;
        packages = { inherit parkfuchs; };
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_24
            pnpm
            bun
          ];
          shellHook = ''
            echo "parkfuchs dev ready ($(node --version), pnpm $(pnpm --version), bun $(bun --version))"
          '';
        };
      }
    );
}
