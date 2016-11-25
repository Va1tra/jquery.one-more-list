import $ from 'jquery';

function HtmlNetStorage(config) {
    this.config = Object.assign({
        url: '',
        lastId: 0,
        getLastId: function(html) {

        },
    }, config);

    this.lastId = this.config.lastId;
    this.noMoreData = false;

    this.prev = () => {
        if (this.noMoreData) {
            return new Promise((resolve, reject) => {
                reject('error.no-more-data');
            });
        } else {
            return new Promise((resolve, reject) => {
                $.get(this.config.url, {
                    from: this.lastId
                }).then(
                    (html) => {
                        let lastId = this.getLastId(html);

                        if (lastId) {
                            resolve(html);
                        } else {
                            this.noMoreData = true;
                            reject('error.no-more-data');
                        }
                    },
                    () => {
                        reject('error.ajax-failed');
                    }
                )
            });
        }
    }
}

export default HtmlNetStorage;