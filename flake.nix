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
        inherit (pkgs) buildNpmPackage bun;
        parkfuchs = buildNpmPackage {
          src = ./.;
          npmBuild = "NEXT_TELEMETRY_DISABLED 1 npm run build";
          npmFlags = [
            "--ingore-scripts"
          ];
          pname = "parkfuchs";
          version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
          npmDepsHash = "sha256-zTDGp4/IqhxyrWkyfqUhdHPq7WPIHMslN5/ZgPxyOzg=";
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
        devShell = pkgs.mkShell { buildInputs = [ bun ]; };
      }
    );
}
