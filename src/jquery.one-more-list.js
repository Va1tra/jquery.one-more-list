import $ from 'jquery';
import _ from 'underscore';
import DumbStorage from 'storage/DumbStorage';
import HtmlNetStorage from 'storage/HtmlNetStorage';

class OneMoreList {

    constructor(container, config) {
        this._config = Object.assign({
            direction: 'topDown',
            storage: ''
        }, config);
        this._config.storage = OneMoreList._createStorage(config.storage);
        this._container = container;

        this._gettingMore = false;
        this._cache = {
            scrollTop: container.scrollTop,
            scrollHeight: container.scrollHeight
        };

        this._init();
    }

    showMore() {
        if (!this._gettingMore) {
            this._showSpinner();

            this._config.storage.prev().then(
                (html) => {
                    if (this._config.direction == 'topDown') {
                        $(this._container).append(html);
                    } else if (this._config.direction == 'bottomUp') {
                        let oldScrollHeight = this._container.scrollHeight;
                        $(this._container).prepend(html);
                        this._container.scrollTop += this._container.scrollHeight - oldScrollHeight;
                    }

                    this._hideSpinner();
                },
                () => {
                    this._hideSpinner();
                }
            );
        }
    }

    /**
     * @param {Node|jQuery} item
     */
    removeItem(item) {
        this._saveScrollPosition();

        $(item).remove();

        this._restoreScrollPosition();
    }

    /**
     * @param {Node|jQuery} item
     */
    appendItem(item) {
        this._saveScrollPosition();

        if (this._config.direction == 'topDown') {
            $(this._container).prepend(item);
        } else if (this._config.direction == 'bottomUp') {
            $(this._container).append(item);
        }

        this._restoreScrollPosition('append');
    }

    _showSpinner() {
        this._gettingMore = true;
        this._container.classList.add('__fetching');
    }

    _hideSpinner() {
        this._gettingMore = false;
        this._container.classList.remove('__fetching');
    }

    _saveScrollPosition() {
        this._cache.scrollTop = this._container.scrollTop;
        this._cache.scrollHeight = this._container.scrollHeight;
        this._cache.clientHeight = this._container.clientHeight;
    }

    _restoreScrollPosition(action) {
        if (this._config.direction == 'topDown') {
            if (action == 'append') {
                if (this._cache.scrollTop != 0) {
                    this._container.scrollTop = this._cache.scrollTop + (this._container.scrollHeight - this._cache.scrollHeight);
                }
            } else {

            }
        } else if (this._config.direction == 'bottomUp') {
            if (action == 'append') {
                if (this._cache.clientHeight == this._cache.scrollHeight - this._cache.scrollTop) {
                    this._container.scrollTop = this._container.scrollHeight - this._container.clientHeight;
                }
            } else {
                this._container.scrollTop = this._cache.scrollTop + (this._container.scrollHeight - this._cache.scrollHeight);
            }
        }
    }

    _init() {
        $(this._container).on('scroll', _.debounce((e) => {
            if (this._config.direction == 'topDown') {
                if (this._container.scrollHeight - this._container.clientHeight - this._container.scrollTop < Math.max(Math.min(200, this._container.clientHeight * 0.2), 50)) {
                    this.showMore();
                }
            } else if (this._config.direction == 'bottomUp') {
                if (this._container.scrollTop < Math.max(Math.min(200, this._container.clientHeight * 0.2), 50)) {
                    this.showMore();
                }
            }
        }, 50)).scroll();

        if (this._config.direction == 'bottomUp') {
            this._container.scrollTop = this._container.scrollHeight - this._container.clientHeight;
        }
    }

    static _createStorage(config) {
        if (!config) {
            return new DumbStorage();
        } else if (config.type == 'net') {
            return new HtmlNetStorage(config);
        } else {
            return config;
        }
    }

    static _jQueryInterface(method) {
        if (typeof method === 'object' || !method) {
            this.data('one-more-list', new OneMoreList(this[0], method));
        } else if ($(this).data('one-more-list')[method]) {
            this.data('one-more-list')[method].apply(this.data('one-more-list'), Array.prototype.slice.call(arguments, 1));
        } else {
            console.error('Unable to find method "' + method + '" for jquery.one-more-list');
        }
    }
}

$.fn.list = OneMoreList._jQueryInterface;

export default OneMoreList;