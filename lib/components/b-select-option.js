import { mergeData } from "../utils";

export const props = {
    value: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    }
};

export default {
    functional: true,
    props,
    render(h, { props, data, children }) {
        return h(
            'option',
            mergeData(data, {
                attrs: {
                    "value": props.value,
                    "disabled": props.disabled
                }
            }),
            children
        );
    }
};
