'use babel';

import AtomXtermView from './xterm-view';
import StatusBarView from './status-bar-view';

import {
    CompositeDisposable,
    Disposable
} from 'atom';

export default {

    statusBarView: null,
    statusBarTile: null,

    activate(state) {
        this.statusBarView = new StatusBarView(state.StatusBarView);
    },

    deactivate() {
        this.statusBarView.destroy();
        this.statusBarTile.destroy();
    },

    serialize() {
        return {
            StatusBarViewState: this.statusBarView.serialize()
        };
    },

    consumeStatusBar(statusBar) {
        this.statusBarTile = statusBar.addLeftTile({item: this.statusBarView.getElement(), priority: 100})
    }
};