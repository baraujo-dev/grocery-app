import dev from "./dev";
import test from "./test";
import prod from "./prod";
import type { AppConfig } from "@grocery/shared";

const mode = import.meta.env.MODE;

const config: AppConfig =
  mode === "production" ? prod : mode === "test" ? test : dev;

export default config;
