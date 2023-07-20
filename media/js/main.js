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

        localStorage.setItem('selectedData', textarea.value);
        handleLoading(true);
        vscode.postMessage({ type: 'queryChatGPT', value: textarea.value });
        break;
      }
      case 'onChatGPTResponse': {
        handleLoading(false);
        const existingArrayString = localStorage.getItem('arrayGptOutput');
        const selectedArrayString = localStorage.getItem('selectedArray');
        let existingArray = [];
        let selectedArray = [];

        if (existingArrayString && selectedArray) {
          existingArray = JSON.parse(existingArrayString);
          selectedArray = JSON.parse(selectedArrayString);
        }

        existingArray.push(message.value);
        selectedArray.push(localStorage.getItem('selectedData'));
        const clearInput = document.getElementById('input-query');
        clearInput.style.height = '';
        clearInput.value = '';
        localStorage.setItem('selectedData', clearInput.value);
        clearInput.ariaPlaceholder = 'Highlight code snippet to ask GPT...';

        const updatedArrayString = JSON.stringify(existingArray);
        const updatedSelectedArrayString = JSON.stringify(selectedArray);

        localStorage.setItem('arrayGptOutput', updatedArrayString);
        localStorage.setItem('selectedArray', updatedSelectedArrayString);
        displayRecent();
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
    let cancel = document.getElementById('cancel');
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
  const cancelLoading = document.getElementById('cancel');
  cancelLoading.onclick = () => {
    vscode.postMessage({ type: 'cancelQuery', value: null });
  };

  function displayRecent() {
    if (localStorage.getItem('arrayGptOutput')) {
      const textarea = document.querySelector('.card-indicator');
      textarea.classList.add('hidden');
      const container = document.querySelector('.dialog-box');
      const data = JSON.parse(localStorage.getItem('arrayGptOutput'));
      const selectedData = JSON.parse(localStorage.getItem('selectedArray'));

      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          const existingData = Array.from(
            container.querySelectorAll('textarea')
          ).map((textarea) => textarea.value);
          if (!existingData.includes(data[i])) {
            const card = document.createElement('div');
            card.className = 'card border-right';

            const textareaClone = document.createElement('textarea');
            textareaClone.value = data[i];
            textareaClone.readOnly = true;
            textareaClone.style.height = 'auto';
            textareaClone.className = 'response-container w-full p-2';

            card.appendChild(textareaClone);
            container.insertBefore(card, container.firstChild);
            textareaClone.style.height =
              Math.min(textareaClone.scrollHeight, 500) + 'px';

            const selectedCard = document.createElement('div');
            selectedCard.className = 'card border-left';

            const selectedClone = document.createElement('textarea');
            selectedClone.value = selectedData[i];
            selectedClone.readOnly = true;
            selectedClone.style.height = 'auto';
            selectedClone.className = 'response-container w-full p-2';

            selectedCard.appendChild(selectedClone);
            container.insertBefore(selectedCard, container.firstChild);
            selectedClone.style.height =
              Math.min(selectedClone.scrollHeight, 500) + 'px';
          }
        }
      } else {
        const textarea = document.querySelector('.card-indicator');
        textarea.classList.remove('hidden');
      }
    }
  }
})();
