'use babel';

import Terminal from 'xterm';
import pty from 'pty.js';
import $ from './util';

export default class AtomXtermView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('xterm');
        
        const divider = document.createElement('div');
        divider.classList.add('divider');
        let position = null;
        $(this.element).on('mousedown', '.divider', (e) => {
            position = e;
        });
        document.addEventListener('mouseup', (e) => {
            position = null;
        });
        $(this.element).on('mousemove', '.divider', (e) => {
            if (position) {
                const delta = position.clientY - e.clientY;
                position= e;
                const height = this.element.clientHeight + delta;
                this.element.style.height = height + 'px';
                this.resize();
            }
        });
        this.element.appendChild(divider);

        Terminal.loadAddon('fit');
        this.terminal = new Terminal({
            cursorBlink: false,  // Do not blink the terminal's cursor
            cols: 80,  // Set the terminal's width to 120 columns
            rows: 10  // Set the terminal's height to 80 rows
        });

        this.cp = pty.spawn('bash', [], {
            name: 'xterm-color',
            cols: 80,
            rows: 10,
            cwd: atom.project.getPaths()[0] || process.env.HOME,
            env: process.env
        });
        this.terminal.open(this.element, true);
        // this.terminal.write('Hello from \033[1;3;31mxterm.js\033[0m $ ');
        this.cp.on('data', (data) => {
            return this.terminal.write(data);
        });
        this.terminal.on('data', (data) => {
            return this.cp.write(data);
        });
        this.resize();
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.terminal.destroy();
        this.cp.destroy();
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    resize() {
        this.terminal.fit();
        this.cp.resize(this.terminal.cols, this.terminal.rows);
    }

}
