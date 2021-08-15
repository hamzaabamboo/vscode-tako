import vscode, { ExtensionContext } from "vscode";
import { TakoState } from "../types/tako";

export class Storage {
  private _context?: ExtensionContext;

  constructor() {}

  init(context: ExtensionContext) {
    this._context = context;
  }

  get isReady() {
    return !!this._context;
  }

  set<T extends keyof TakoState>(key: T, value?: TakoState[T]) {
    if (!this._context) throw new Error("Not initialized");
    this._context?.workspaceState.update(key, value);
  }
  get<T extends keyof TakoState>(key: T): TakoState[T] | undefined {
    if (!this._context) return;
    if (!this._context?.workspaceState.keys().includes(key)) return;
    return this._context?.workspaceState.get(key)!;
  }
}

export const storage = new Storage();
