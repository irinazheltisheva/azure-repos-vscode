/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { SCMResource, SCMResourceDecorations, Uri } from "vscode";
import { IPendingChange } from "../interfaces";
import { TfvcSCMProvider } from "../tfvcscmprovider";
import { CreateStatus, Status } from "./status";
import { DecorationProvider } from "./decorationprovider";

export class Resource implements SCMResource {
    private _uri: Uri;
    private _type: Status;
    private _change: IPendingChange;

    constructor(change: IPendingChange) {
        this._change = change;
        this._uri = Uri.file(change.localItem);
        this._type = CreateStatus(change.changeType);
    }

    public get PendingChange(): IPendingChange { return this._change; }
    public get Type(): Status { return this._type; }

    /**
     * This method gets a vscode file uri that represents the server path and version that the local item is based on.
     */
    public GetServerUri(): Uri {
        const serverItem: string = this._change.sourceItem ? this._change.sourceItem : this._change.serverItem;
        const versionSpec: string = "C" + this._change.version;
        return Uri.file(serverItem).with({ scheme: TfvcSCMProvider.scmScheme, query: versionSpec });
    }

    /* Implement SCMResource */
    get uri(): Uri { return this._uri; }
    get decorations(): SCMResourceDecorations {
        // TODO Add conflict type to the resource constructor and pass it here
        return DecorationProvider.getDecorations(this._type);
    }
}