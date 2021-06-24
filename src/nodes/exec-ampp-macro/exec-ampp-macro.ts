import * as url from "url";
import { NodeInitializer } from "node-red";
import { ExecAmppMacroNode, ExecAmppMacroNodeDef } from "./modules/types";

import {
  GVAuthType,
  GVPlatform,
  IGVClientCredentialsAuthConfig,
  IGVImplicitAuthConfig,
  TGVWorkloadVersionType,
  IGVWorkloadDescription,
} from "@gv/base/node";
import { string } from "yargs";
import { json } from "express";

/** 
 * Connects to an AMPP Core deployment
 * 
 * @remark Relies on the GVCLUSTER_PLATFORMAPIKEY and GVCLUSTER_PLATFORMURI env vars.
 * @return A connected instance of GVPlatform. Throws on error.
 */
 function Connect(): GVPlatform {

  // Read the api from env var
  const apiKey = process.env.GVCLUSTER_PLATFORMAPIKEY || "removed";
  // read platform uri from env var
  const platformUri = process.env.GVCLUSTER_PLATFORMURI  || "https://dev-us-west.cloud.grassvalley.com";

  if (!apiKey) {
    throw new Error("GVCLUSTER_PLATFORMAPIKEY environment variable not defined.");
  }

  if (!platformUri) {
    throw new Error("GVCLUSTER_PLATFORMURI environment variable not defined.");
  }

  

  const baseUri = new url.URL(platformUri).origin;
  const clusterUri = platformUri;
  const namespace = "";
  const proxyPath = namespace ? "/" + namespace + process.env.GVServiceUri : process.env.GVServiceUri;
  const clientId = Buffer.from(apiKey, 'base64').toString().split(':')[0];​​​​
  const serviceConfig: IGVClientCredentialsAuthConfig = {
    apiKey: apiKey,
    auth: GVAuthType.CLIENT_CREDENTIALS,
    baseUri: baseUri,
    clientId: clientId,
    platformUri: platformUri,
    clusterUri: clusterUri,
    proxyPath: proxyPath,
    scopes: ["cluster"]
  };​

  console.log(`AMPP Control: Connecting to platform '${platformUri}' ClientId '${clientId}'` )

  var ret = GVPlatform.get(serviceConfig);

  console.log("AMPP Control: connected");

  return ret;

}

let gvPlatform : GVPlatform;


interface MacroMessage {
  uuid: string;
}

const nodeInit: NodeInitializer = (RED): void => {
  function ExecAmppMacroNodeConstructor(
    this: ExecAmppMacroNode,
    config: ExecAmppMacroNodeDef
  ): void {
    RED.nodes.createNode(this, config);

  

    

   
    this.on("input", async (msg, send, done) => {

      console.log("input: " + JSON.stringify(msg));

      gvPlatform = Connect() ;

      console.log("AMPP Control: authenticate");

      try
      {
        let result = await gvPlatform.auth.login();

        if(result != true)
        {
          console.log("AMPP COntrol: Failed to authenticate");    
        }
      }
      catch(err)
      {
        console.log("AMPP Control: authenticate failed: " + err);
      }
    


    let uuid : string = (msg.payload as MacroMessage).uuid;

      let macro = {
        uuid 
      };

      console.log("Macro.UID: " + JSON.stringify(macro));

      let res = await gvPlatform.getClient().post("colin/ampp/control/api/v1/macro/execute", macro);

      if(res.status == 204)
      {
        console.log("Macro UUID: " + JSON.stringify(macro) + "Executed Successfully");
      }
      else
      {
        console.log("Macro UUID: " + JSON.stringify(macro) + "Failed");
      }

      send(msg);
      done();
    });
  }

  RED.nodes.registerType("exec-ampp-macro", ExecAmppMacroNodeConstructor);
};

export = nodeInit;
