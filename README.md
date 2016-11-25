# jquery.one-more-list
Another infinite list implementation.

<h2>Install</h2>

```html
<script src="..../jquery.one-more-list.js"></script>
```

<h2>Example</h2>

```html

<div class="infinite-list">
    <div data-item-id="200">list item with id 200</div>
    <div data-item-id="199">list item with id 199</div>
</div>
```

```js
// Define list with top down direction. When scroll reaches bottom load new items as html from '/api/items?from=199'
// After response parse html to retrieve last item id to save it for the next next request
$('.infinite-list').list({
    direction: 'topDown',
    storage: {
        type: 'net',
        url: '/api/videos',
        lastId: 199,
        getLastId: function(html) {
            return $(html).find('.list-item').last().attr('data-item-id');
        }
    }
});

// If you want you can use your own retieving code
function PageStorage() {
    var _self = this;
     
    this.lastPage = 1;
    this.noMoreData = false;

    this.prev = function() {
        if (_self.noMoreData) {
            return new Promise(function(resolve, reject) {
                reject('error.no-more-data');
            });
        } else {
            return new Promise(function(resolve, reject) {
                $.get('/api/videos?page=' + _self.lastPage + 1).then(
                    function(html) {
                        if (html) {
                            _self.lastPage += 1;
                            resolve(html);
                        } else {
                            _self.noMoreData = true;
                            reject('error.no-more-data');
                        }
                    },
                    function() {
                        reject('error.ajax-failed');
                    }
                )
            });
        }
    }
}

$('.infinite-list').list({
    direction: 'topDown',
    storage: new PageStorage()
});
```

#### Options
- `direction` possible values: `topDown` or `bottomUp`
- `storage` thing that retrieves new items. It must be an object
 ```js
    {
         type: 'net',
         url: yourUrlForRetrievingNewItems, 
         lastId: initialLastItemId,
         getLastId: function(html) {
            return getLastItemId(html);
         }
     }
 ```
or your own implementation with method `prev` returning Promise. Resolved Promise must returned anything
that supported by jQuery.fn.append, jQuery.fn.prepend functions;

#### Methods
- `showMore()`
- `appendItem(item)` 
```js
$('.infinite-list').list('appendItem', $('div').text('my new item'));
```
- `removeItem(item)`
```js
$('.infinite-list').list('removeItem', $('.infinite-list .infinite-list_item[data-id="myId"]'));
```