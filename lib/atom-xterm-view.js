'use babel';

import Terminal from 'xterm';
import pty from 'pty.js';
import $ from './util';

export default class AtomXtermView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('atom-xterm');
        this.toolbar = document.createElement('div');
        this.toolbar.classList.add('atom-xterm-toolbar');
        this.element.appendChild(this.toolbar);
        this.terminal = document.createElement('div');
        this.element.appendChild(this.terminal);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.toolbar.remove();
        this.terminal.remove();
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    getToolbar(terminals, current) {
        const toolbar = document.createElement('div');
        if (terminals.length) {
            const terminalSelect = document.createElement('select');
            terminalSelect.classList.add('input-select', 'atom-xterm-terminal-select');
            terminals.forEach((el, index) => {
                const option = document.createElement('option');
                option.innerText = index + ': bash';
                option.value = index;
                if (current == index) {
                    option.setAttribute('selected', true);
                }
                terminalSelect.appendChild(option);
            });
            toolbar.appendChild(terminalSelect);
            const iconClose =  document.createElement('i');
            iconClose.setAttribute('index', current);
            iconClose.classList.add('icon', 'icon-trashcan');
            toolbar.appendChild(iconClose);
        }
        return toolbar;
    }

    setTerminal(terminals, index) {
        this.terminal.innerHTML = '';
        this.toolbar.innerHTML = this.getToolbar(terminals, index).innerHTML;
        this.index = index;
        terminals.length && this.terminal.appendChild(terminals[index].getElement());
    }
}
