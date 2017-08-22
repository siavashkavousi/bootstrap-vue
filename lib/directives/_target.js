import { keys } from '../utils/object';
const all_listen_types = {hover: true, click: true, focus: true, keyup: true};

export default function targets (vnode, binding, listen_types, fn) {

    const targets = keys(binding.modifiers || {})
        .filter(t => !all_listen_types[t]);

    if (binding.value) {
        targets.push(binding.value);
    }

    const listener = (event) => {
        fn({targets, vnode, event});
    };

    keys(all_listen_types).forEach(type => {
        if (listen_types[type] || binding.modifiers[type]) {
            vnode.elm.addEventListener(type, listener);
        }
    });

    // Return the list of targets
    return targets;
}
