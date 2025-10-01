import { ReactNode } from "react";

export type Enum = Record<string, number>;
export type EnumLabels = Record<Enum[keyof Enum], string>;

export interface RouteDefinition {
  displayName?: string;
  path?: string;
  element?: ReactNode;
  index?: boolean;
  children?: RouteDefinition[]
}
