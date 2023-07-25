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

  vscode.window.onDidChangeTextEditorSelection((event) => {
    if (event.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
      return;
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const selection = editor.selection;
    if (selection.isEmpty) {
      return;
    }
    const highlightedText = editor.document.getText(selection);
    sidebarProvider._view?.webview.postMessage({
      type: 'onSelectedText',
      value: highlightedText,
    });
  });

  context.subscriptions.push(apiKeyCommandDisposable);

  const runTranslationCommand = async (type: string) => {
    await vscode.commands.executeCommand(
      'sim-chatgpt-translator-sidebar.focus'
    );
    setTimeout(() => {
      sidebarProvider._view?.show();
      const editor = vscode.window.activeTextEditor;
      const selection = editor?.selection;
      const highlightedText = editor?.document.getText(selection);
      sidebarProvider._view?.webview.postMessage({
        type: 'onSelectedText',
        value: highlightedText,
      });
      let query = `Convert the code below to ${type} and explain:\n`;
      sidebarProvider._view?.webview.postMessage({
        type: 'onCommandClicked',
        value: query,
      });
    }, 100);
  };

  const reactCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runReact',
    () => runTranslationCommand('React')
  );
  context.subscriptions.push(reactCommandDisposable);

  const javaScriptCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runJavaScript',
    () => runTranslationCommand('JavaScript')
  );
  context.subscriptions.push(javaScriptCommandDisposable);

  const typeScriptCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runTypeScript',
    () => runTranslationCommand('TypeScript')
  );
  context.subscriptions.push(typeScriptCommandDisposable);

  const vueCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runVue',
    () => runTranslationCommand('Vue')
  );
  context.subscriptions.push(vueCommandDisposable);

  const phpCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runPHP',
    () => runTranslationCommand('PHP')
  );
  context.subscriptions.push(phpCommandDisposable);

  const rubyCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runRuby',
    () => runTranslationCommand('Ruby')
  );
  context.subscriptions.push(rubyCommandDisposable);

  const pythonCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runPython',
    () => runTranslationCommand('Python')
  );
  context.subscriptions.push(pythonCommandDisposable);

  const cSharpCommandDisposable = vscode.commands.registerCommand(
    'sim-chatgpt-translator.runC#',
    () => runTranslationCommand('C#')
  );
  context.subscriptions.push(cSharpCommandDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
