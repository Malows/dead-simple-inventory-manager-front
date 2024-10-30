/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    NAME: string;
    HOST: string;
    CLIENT_SECRET: string;
    CLIENT_ID: string;
    STORAGE_PREFIX: string;
  }
}
