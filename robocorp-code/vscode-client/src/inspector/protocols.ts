/**
 * @source https://github.com/robocorp/inspector-ext/blob/master/src/vscode/protocols.ts
 *! THIS FILE NEEDS TO ALWAYS MATCH THE SOURCE
 */

import { Locator, LocatorsMap } from "./types";

export enum IMessageType {
    REQUEST = "request",
    RESPONSE = "response",
    EVENT = "event",
}

export enum IApps {
    LOCATORS_MANAGER = "locatorsManager",
    WEB_RECORDER = "webRecorder",
    WINDOWS_RECORDER = "windowsRecorder",
}

export type IAppsType = IApps.LOCATORS_MANAGER | IApps.WEB_RECORDER | IApps.WINDOWS_RECORDER;

// =====================================
// REQUESTS
// =====================================
export type IManagerCommands = { type: "getLocators" } | { type: "delete"; ids: string[] };
export type IWebRecorderCommands =
    | { type: "getLocators" }
    | { type: "startPicking" }
    | { type: "stopPicking" }
    | { type: "delete"; ids: string[] }
    | { type: "save"; locator: Locator }
    | { type: "validate"; locator: Locator };

export type IWindowsRecorderCommands =
    | { type: "getLocators" }
    | { type: "getAppWindows" }
    | { type: "collectAppTree"; locator: string; depth?: number; strategy?: "all" | "siblings" }
    | { type: "setSelectedApp"; handle: string }
    | { type: "validateLocatorSyntax"; locator: string }
    | { type: "startPicking" }
    | { type: "stopPicking" }
    | { type: "startHighlighting"; locator: string; depth?: number; strategy?: "all" | "siblings" }
    | { type: "stopHighlighting" }
    | { type: "validate"; locator: Locator };

// IResponseMessage - should be sent with an expectation of Response
export interface IRequestMessage {
    id: string;
    type: IMessageType.REQUEST;
    app: IAppsType;
    command: IManagerCommands | IWebRecorderCommands | IWindowsRecorderCommands;
}

// =====================================
// RESPONSES
// =====================================
export type ResponseDataType = "locator" | "locatorsMap" | "winApps" | "winAppTree";
export type WindowsAppDetails = { executable: string; name: string; handle: string };
export type WindowsAppsResponse = WindowsAppDetails[];
export type WindowsAppElement = {
    control: string;
    class: string;
    name: string;
    automation_id: string;
    handle: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    xcenter: number;
    ycenter: number;
    depth: number;
    child_pos: number;
    path: string;
};
export type WindowsAppTree = WindowsAppElement[];
export type WindowsAppTreeResponse = {
    matched_paths: string[];
    hierarchy: WindowsAppTree;
};

// IResponseMessage - should respond to a Request
export interface IResponseMessage {
    id: string;
    type: IMessageType.RESPONSE;
    app: IAppsType;
    status: "success" | "failure";
    message?: string;
    data?:
        | {
              type: "locator";
              value: Locator;
          }
        | {
              type: "locatorsMap";
              value: LocatorsMap;
          }
        | { type: "winApps"; value: WindowsAppsResponse }
        | {
              type: "winAppTree";
              value: WindowsAppTreeResponse;
          };
}
// IResponseMessage - should be equidistant from Requests or Responses
export interface IEventMessage {
    id: string;
    type: IMessageType.EVENT;
    event:
        | {
              type: "pickedLocator";
              status: "success" | "failure";
              message?: string;
              data: Locator;
          }
        | {
              type: "pickedWinLocatorTree";
              status: "success" | "failure";
              message?: string;
              data: WindowsAppTree;
          };
}
export type IMessage = IRequestMessage | IResponseMessage | IEventMessage;
