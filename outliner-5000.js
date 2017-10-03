
//
// Expose a global for Outliner5000
// - initial function immediatly called, see actual function definition under helpers
//
window.Outliner5000 = (() => {

    // foreach helper
    let each = (arr, func) => [].forEach.call(arr, func);
    
    // on/off event helper (delay setting on events to make sure current event doesn't trigger them)
    let on = (el, name, func) => setTimeout(() => el.addEventListener(name, func), 0);
    let off = (el, name, func) => setTimeout(() => el.removeEventListener(name, func), 0);

    // find an element
    let find = selector => document.querySelectorAll(selector);
    let findOne = selector => document.querySelector(selector);

    // extend an object
    let extend = (first, second) => Object.assign({}, first, second);

    // add/remove class helper
    let addClass = (el, className) => {
        if (el.length) {
            return each(el, e => addClass(e, className));
        }
        el.classList.add(className);
    };
    let removeClass = (el, className) => {
        if (el.length) {
            return each(el, e => removeClass(e, className));
        }
        el.classList.remove(className);
    };
    
    /**
     * Outliner5000 function
     * 
     * @example
     * // log the text of the selected element and then cancel selection picker
     * Outliner500({ removeOnCallback: true }, target => console.log(target.textContent.trim()));
     * 
     * @example
     * // log the element
     * let outliner = Outliner500({}, console.log);
     * setTimeout(outliner.finish, 10000); // give the user 10 seconds to select the element
     * 
     * @param {Object} options Available to customise the instance, see defaults
     * @param {Function} callback Handle selected element, passed target element reference
     * 
     * @return {Object} contains finish method, needed to cleanup page unless removeOnCallback: true set in options
     */
    return (options, callback) => {

        // settings for this instance
        let settings = extend({
            removeOnCallback: false,
            highlightSelected: true,
            finishCallback: null,
        }, options || {});

        // make sure outliner class added to page
        document.body.insertAdjacentHTML('afterend', `
            <style id="outliner-5000-style-block">
                .outliner5000 {
                    outline: 2px solid red;
                }
                .outliner5000-selected{
                    outline:2px solid blue;
                }
            </style>
        `);

        // on hover add/remove the outline class
        let previousElement = null;
        let handleHoverOver = event => {
            addClass(event.target, 'outliner5000');
            previousElement = event.target;
        };
        let handleHoverOut = event => {
            let el = event ? event.target : previousElement;
            if (el) {
                removeClass(el, 'outliner5000');
            }
        };
        on(document.body, 'mouseover', handleHoverOver);
        on(document.body, 'mouseout', handleHoverOut);

        // handle removing previous selected
        let removePreviousSelection = () => {
            let currentlySelected = find('.outliner5000-selected');
            if (currentlySelected.length) {
                removeClass(currentlySelected, 'outliner5000-selected');
            }
        };

        // on click, select an element
        let handleClick = event => {
            event.preventDefault();
            event.stopPropagation();

            // handle callback
            callback(event.target);

            // mark as selected visually
            if (settings.highlightSelected) {
                removePreviousSelection();
                addClass(event.target, 'outliner5000-selected');
            }

            // cancel eveyhting now it's done?
            if (settings.removeOnCallback) {
                finish(settings.finishCallback);
            }
        };
        on(document.body, 'click', handleClick);

        // cleanup by removing any event handlers we registered
        let finish = (finishCallback) => {
            handleHoverOut(); // call one last hover-out
            off(document.body, 'mouseover', handleHoverOver);
            off(document.body, 'mouseout', handleHoverOut);
            off(document.body, 'click', handleClick);

            // remove selected class
            if (settings.highlightSelected) {
                removePreviousSelection();
            }

            // remove style block
            findOne('#outliner-5000-style-block').remove();

            // finished, any callback to run?
            if (typeof finishCallback === 'function') {
                finishCallback();
            }
        };

        // expose public finish method
        return {
            finish,
        };
    };

})();
