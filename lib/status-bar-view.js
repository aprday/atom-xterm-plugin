'use babel';

import Terminal from 'xterm';
import pty from 'pty.js';
import XtermView from './xterm-view';
import AtomXtermView from './atom-xterm-view';
import $ from './util';

export default class StatusBarView {
    constructor(serializedState) {
        this.terminals = [];
        this.icons = [];
        this.atomXtermView = new AtomXtermView();
        this.bottomPanel = atom.workspace.addBottomPanel({item: this.atomXtermView.getElement(), visible: true});
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('terminal-status');
        const iconPlus =  document.createElement('i');
        iconPlus.classList.add('icon', 'icon-plus');
        this.iconList =  document.createElement('span');
        this.iconList.classList.add('icon-list');
        const iconX =  document.createElement('i');
        iconX.classList.add('icon', 'icon-x');
        this.element.appendChild(iconPlus);
        this.element.appendChild(this.iconList);
        this.element.appendChild(iconX);
        this.bindEvent();
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.terminals.forEach((el) => {
            el.destroy();
        });
        this.terminals = [];
        this.atomXtermView.destroy();
        this.bottomPanel.destroy();
        this.iconList.remove();
        this.element.remove();
    }
    getElement() {
        return this.element;
    }

    bindEvent() {
        $(this.element).on('click', '.icon-plus', () => {
            const iconTerminal =  document.createElement('i');
            iconTerminal.classList.add('icon', 'icon-terminal');
            this.iconList.appendChild(iconTerminal);
            this.terminals.push(new XtermView());
            let index = this.terminals.length - 1;
            iconTerminal.setAttribute('index', index);
            this.iconList.childNodes.forEach((el) => {
                el.classList.remove('current');
            });
            iconTerminal.classList.add('current');
            this.atomXtermView.setTerminal(this.terminals, index);
        });
        $(this.element).on('click', '.icon-terminal', (e) => {
            const index = e.target.getAttribute('index');
            this.iconList.childNodes.forEach((el) => {
                el.classList.remove('current');
            });
            e.target.classList.add('current');
            this.atomXtermView.setTerminal(this.terminals, index);
        });
        $(this.element).on('click', '.icon-x', (e) => {
            this.terminals.forEach((el) => {
                el.destroy();
            });
            this.terminals = [];
            this.atomXtermView.setTerminal([], -1);
            this.iconList.innerHTML = '';
        });
        $(document).on('click', '.icon-trashcan', (e) => {
            const index = e.target.getAttribute('index');
            this.terminals[index].destroy();
            this.terminals.splice(index, 1);
            this.iconList.childNodes[index].remove();
            this.atomXtermView.setTerminal(this.terminals, 0);
        });
        $(document).on('change', '.atom-xterm-terminal-select', (e) => {
            const index = e.target.value;
            this.iconList.childNodes.forEach((el) => {
                el.classList.remove('current');
            });
            this.iconList.childNodes[index].classList.add('current');
            this.atomXtermView.setTerminal(this.terminals, index);
        });
    }

}
