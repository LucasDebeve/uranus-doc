// require.context est fourni par webpack (utilisé par la fiche de révision).
declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp,
    ): {
      keys(): string[];
      (id: string): unknown;
    };
  }
}
