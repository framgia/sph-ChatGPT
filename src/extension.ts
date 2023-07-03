import * as vscode from 'vscode';
import { SidebarProvider } from './providers/SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context);
  const sidebarDisposable = vscode.window.registerWebviewViewProvider(
    'sim-chatgpt-translator-sidebar',
    sidebarProvider
  );
  context.subscriptions.push(sidebarDisposable);

  const apiKeyCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runApiKey',
    () => {
      sidebarProvider._view?.webview.postMessage({
        type: 'isApiKeyClicked',
        value: true,
      });
    }
  );
  context.subscriptions.push(apiKeyCommandDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
