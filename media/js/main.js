'use strict';
//@ts-check
// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();
  document.getElementById('myForm').addEventListener('submit', handleSubmit);
  window.addEventListener(
    'load',
    () => {
      vscode.postMessage({ type: 'getApiKey', value: null });
    },
    { capture: true }
  );
  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'isApiKeyClicked': {
        let form = document.getElementById('myForm');
        if (form.classList.contains('hidden')) {
          getApiInputField('visible');
        } else {
          getApiInputField('hidden');
        }
        break;
      }
      case 'onLoadApiKey': {
        if (message.value) {
          getApiInputField('hidden');
        }
        break;
      }
      case 'onSelectedText': {
        const textarea = document.getElementById('input-query');
        textarea.value = message.value;
        textarea.style.height = '';
        textarea.style.height = Math.min(textarea.scrollHeight, 500) + 'px';
        break;
      }
      case 'onCommandClicked': {
        const textarea = document.getElementById('input-query');
        textarea.value = message.value + textarea.value;
        textarea.style.height = '';
        textarea.style.height = Math.min(textarea.scrollHeight, 500) + 'px';
        handleLoading(true);
        vscode.postMessage({ type: 'queryChatGPT', value: textarea.value });
        break;
      }
      case 'onChatGPTResponse': {
        handleLoading(false);
        const container = document.getElementById('response-container');
        container.value = message.value;
        container.style.height = '';
        container.style.height = container.scrollHeight + 'px';
        break;
      }
    }
  });

  function handleSubmit(event) {
    event.preventDefault();
    let apiKeyInput = document.getElementById('api-key');
    let apiKey = apiKeyInput.value.trim();
    if (apiKey !== '') {
      getApiInputField('hidden');
      vscode.postMessage({ type: 'saveApiKey', value: apiKey });
    }
  }

  function getApiInputField(visibility) {
    let form = document.getElementById('myForm');
    let message = document.getElementById('message');
    let divider = document.getElementById('divider');
    if (visibility === 'hidden') {
      message.classList.add(visibility);
      form.classList.add(visibility);
      divider.classList.add(visibility);
    } else {
      message.classList.remove('hidden');
      form.classList.remove('hidden');
      divider.classList.remove('hidden');
    }
    document.getElementById('myForm').reset();
  }

  const clearInput = document.getElementById('clear-input');
  clearInput.onclick = () => {
    const textarea = document.getElementById('input-query');
    textarea.value = '';
    textarea.style.height = '';
  };
  function handleLoading(isLoading) {
    let searchOutput = document.getElementById('response-container');
    let loading = document.getElementById('gear-container');
    let cancel = document.getElementById('cancel-request');
    if (isLoading) {
      searchOutput.classList.add('hidden');
      loading.classList.remove('hidden');
      cancel.classList.remove('hidden');
    } else {
      searchOutput.classList.remove('hidden');
      loading.classList.add('hidden');
      cancel.classList.add('hidden');
    }
  }
  const cancelLoading = document.getElementById('cancel-request');
  cancelLoading.onclick = () => {
    vscode.postMessage({ type: 'cancelQuery', value: null });
  };
})();
