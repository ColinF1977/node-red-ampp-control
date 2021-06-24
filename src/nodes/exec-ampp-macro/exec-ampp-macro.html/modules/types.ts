import { EditorNodeProperties } from "node-red";
import { ExecAmppMacroOptions } from "../../shared/types";

export interface ExecAmppMacroEditorNodeProperties
  extends EditorNodeProperties,
    ExecAmppMacroOptions {}
