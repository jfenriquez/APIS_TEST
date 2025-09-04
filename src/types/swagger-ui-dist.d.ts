/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "swagger-ui-dist/swagger-ui-bundle" {
  export interface SwaggerUIOptions {
    domNode: HTMLElement;
    url?: string;
    spec?: Record<string, unknown>;
    presets?: any[];
    layout?: string;
  }

  export type SwaggerUIBundle = (options: SwaggerUIOptions) => unknown;

  const SwaggerUI: SwaggerUIBundle;
  export default SwaggerUI;
}

declare module "swagger-ui-dist/swagger-ui.css";
