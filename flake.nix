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
      nixosModules.parkfuchs = import ./nix { inherit self nixpkgs; };
    }
    // flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        inherit (pkgs) buildNpmPackage nodejs_22;
        parkfuchs = buildNpmPackage {
          src = ./.;
          npmBuild = "NEXT_TELEMETRY_DISABLED 1 npm run build";
          npmFlags = [
            "--ingore-scripts"
            "--legacy-peer-deps"
          ];
          pname = "parkfuchs";
          version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
          npmDepsHash = "sha256-VWtEM8+qvL8FQP8cQ0dd/GF5xr8oD3KW31/7DcyEwEg=";
          installPhase = ''
                        runHook preInstall
            			mkdir -p $out/.next
            			cp -r .next/standalone/. $out/
            			cp -r .next/static $out/.next/
            			cp -r ./public $out/
            			runHook postInstall'';
        };
      in
      {
        defaultPackage = parkfuchs;
        packages = { inherit parkfuchs; };
        devShell = pkgs.mkShell { buildInputs = [ nodejs_22 ]; };
      }
    );
}
