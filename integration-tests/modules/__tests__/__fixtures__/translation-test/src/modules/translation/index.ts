import { Module } from "@medusajs/framework/utils";
import { TranslationModule } from "./service";

export const TRANSLATION = "translation";

export default Module(TRANSLATION, {
  service: TranslationModule,
});
