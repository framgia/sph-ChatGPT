import * as vscode from 'vscode';
export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media/icons', 'icon.svg')
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media/css', 'reset.css')
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media/css', 'vscode.css')
    );
    const userUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media/icons', 'user.svg')
    );
    const trashUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media/icons', 'trash.svg')
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self'; font-src 'self'; img-src 'self' data: 'data:image/svg+xml' https:; style-src ${webview.cspSource};  script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
			</head>
      <body>
      <div class="flex mb-5">
        <textarea id="input-query" readonly placeholder="Highlight code snippet to ask GPT..." class="w-full resize-vertical rounded-md p-2"></textarea>
        <div class="user space-y-2">
          <img src="${userUri}">
          <img class="trash" id="clear-input" src="${trashUri}">
        </div>
      </div>
      <div class="flex" id="search-output">
        <div class="logo">
          <img src="${logoUri}">
        </div>
        <div class="card" readonly">
          <textarea id="response-container" readonly class="w-full p-2" placeholder="Hello! Do you have any programming language you would like me to translate?"></textarea>
        </div>
      </div>
	    </body>
	</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
