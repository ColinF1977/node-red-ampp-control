import { EditorRED } from "node-red";
import { ExecAmppMacroEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ExecAmppMacroEditorNodeProperties>("exec-ampp-macro", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "exec ampp macro",
  label: function () {
    return this.name || "exec ampp macro";
  },
});
