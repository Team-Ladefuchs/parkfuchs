{
  description = "My example Nix flake";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, unstable, ... }: {
    nixosModules.parkfuchs = import ./nix { inherit self nixpkgs unstable; };
  } // flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      inherit (pkgs) buildNpmPackage nodejs_20;
      nodejs = nodejs_20;
      parkfuchs = buildNpmPackage {
        src = ./.;
        npmBuild = "NEXT_TELEMETRY_DISABLED 1 npm run build";
        npmPackFlags = [ "--ignore-scripts" ];
        pname = "parkfuchs";
        version = "1.6.5";
        npmDepsHash = "sha256-L4440lAbgc0U06KlzIqcnyTc5lnrH678apbraK+6mQ8=";
        installPhase = ''
          			runHook preInstall
          			mkdir -p $out/.next
          			cp -r .next/standalone/. $out/
          			cp -r .next/static $out/.next/
          			cp -r ./public $out/
          			runHook postInstall
          		  '';
      };
    in
    {
      defaultPackage = parkfuchs;
      packages = {
        inherit parkfuchs;
      };
      devShell = pkgs.mkShell { buildInputs = [ nodejs ]; };
    });
}
