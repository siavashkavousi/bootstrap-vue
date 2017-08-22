const inBrowser = typeof window !== 'undefined';

import target from './_target';
const listen_types = {click: true, keyup: true};

// Property key for handler
const BVT = '__BV_toggle__';

// Event nmmes
const EVENT_TOGGLE = 'collapse::toggle';
const EVENT_STATE = 'collapse::toggle::state';

export default {

    bind(el, binding, vnode) {
        const isActionEl = el.tagName === 'BUTTON' || el.tagName ='A';
        
        if (!isActionEl) {
            // If we are not an action element, make sure we are in page tabIndex
            el.tabIndex = 0;
            // Also instruct assitive technologoes that we act as a button
            el.setAttribute('role', 'button');
        }
        
        // Set up event listeners
        const targets = target(vnode, binding, listen_types, ({targets, vnode, event}) => {
            // Special handling of keyup events
            if (event.type === 'keyup') {
                // Handle keyup events on non-action elements (i.e. divs, etc)
                if (isActionEl) {
                    // Dont handle keyup if we are A or BUTTON, as that is translated to click for us
                    return;
                }
                const keyCode = event.keyCode || event.which;
                if (keyCode !== 32 && keyCode !== 13) {
                    // We only handle space and enter
                    return;
                }
                // Stop page from scrolling on space
                event.preventDefault();
            }
            // Send togle commands to targets
            targets.forEach(target => {
                vnode.context.$root.$emit(EVENT_TOGGLE, target);
            });
        });

        if (inBrowser && vnode.context && targets.length > 0) {
            // Add aria attributes to element
            el.setAttribute('aria-controls', targets.join(' '));
            el.setAttribute('aria-expanded', 'false');

            // Toggle state hadnler, stored on element
            el[BVT] = function toggleDirectiveHandler(id, state) {
                if (targets.indexOf(id) !== -1) {
                    // Set aria-expanded state
                    el.setAttribute('aria-expanded', state ? 'true' : 'false');
                    // Set 'collapsed' class state
                    if (state) {
                        el.classList.remove('collapsed');
                    } else {
                        el.classList.add('collapsed');
                    }
                }
            };

            // Listen for toggle state changes
            vnode.context.$root.$on(EVENT_STATE, el[BVT]);
        }
    },
    unbind(el, binding, vnode) {
        if (el[BVT]) {
            // Remove our $root listener
            vnode.context.$root.$off(EVENT_STATE, el[BVT]);
            el[BVT] = null;
        }
    }
};
