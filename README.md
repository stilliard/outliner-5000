# outliner-5000.js !!

Create an inspector like highlight select on hover of elements to select a specific element and handle with a callback.

Bring in this script by copying/downloading the `outliner-5000.js` file. 

Or install with `bower` or `npm` under the package name `outliner-5000`.

## Usage

```javascript
Outliner5000(options, callback);
```

## Example 1

Simple usage for user to select an element and it return it's text:

```javascript
Outliner500({}, target => console.log(target.textContent.trim()));
```

## Example 2

Get css path for selected element, see `examples/index.html`.


## Options available

    removeOnCallback: true | false (default: false)
        - Removes selection picker once user has selected element.

    highlightSelected: true | false (default: true)
        - Highlight the selected element once selected (unless removeOnCallback set to true).

    finishCallback: Function
        - Callback once finish called.

## Browser support

Current version was built for use in a chrome extension so it's browser support is pretty much just the latest browsers. But shouldn't take much tweaking to get any older browser support in.
