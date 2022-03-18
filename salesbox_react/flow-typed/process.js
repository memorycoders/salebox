//@flow
declare var process: {
  browser: boolean,
  env: {
    NODE_ENV: string,
    PORT: number,
  },
};

declare function addTranslations({}): void;
