import * as vscode from 'vscode';
import { SidebarProvider } from './providers/SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  const sidebarDisposable = vscode.window.registerWebviewViewProvider(
    'sim-chatgpt-translator-sidebar',
    sidebarProvider
  );
  context.subscriptions.push(sidebarDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
