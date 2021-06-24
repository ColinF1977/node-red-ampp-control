import { Node, NodeDef } from "node-red";
import { ExecAmppMacroOptions } from "../shared/types";

export interface ExecAmppMacroNodeDef extends NodeDef, ExecAmppMacroOptions {}

// export interface ExecAmppMacroNode extends Node {}
export type ExecAmppMacroNode = Node;
