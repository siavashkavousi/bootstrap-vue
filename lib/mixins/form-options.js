import { isArray } from '../utils/array';
import { keys } from '../utils/object';

export default {
    computed: {
        formOptions() {
            let options = this.options || {};

            if (isArray(options)) {
                // Normalize flat arrays to object Array
                options = options.map(option => {
                    if (typeof option === 'object') {
                        return {
                            value: option[this.valueField],
                            text: option[this.textField],
                            disabled: option.disabled || false
                        };
                    }

                    return {text: String(option), value: option || {}};
                });
            } else {
                // Normalize Objects keys to Array
                options = keys(options).map(value => {
                    let option = options[value] || {};

                    // Resolve text
                    if (typeof option !== 'object') {
                        option = {text: String(option)};
                    }

                    // Resolve value (uses key as value if not provided)
                    option.value = option[this.valueField] || value;

                    // Resolve text field (uses key as value if not provided)
                    option.text = option[this.textField] || value;

                    return option;
                });
            }

            return options;
        }
    },
    props: {
        options: {
            type: [Array, Object],
            default: []
        },
        valueField: {
            type: String,
            default: 'value'
        },
        textField: {
            type: String,
            default: 'text'
        }
    }
};
