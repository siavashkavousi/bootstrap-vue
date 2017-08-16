<template>
    <select :class="inputClass"
            :name="name"
            :id="id || null"
            v-model="value"
            :multiple="multiple || null"
            :size="(multiple || selectSize > 1) ? selectSize : null"
            :disabled="disabled"
            :required="required"
            :aria-required="required ? 'true' : null"
            :aria-invalid="computedAriaInvalid"
            ref="input"
    >
        <slot name="first"><slot>
        <b-form-option v-for="(option, idx) in formOptions"
                :value="option.value"
                :disabled="option.disabled"
                :key="`option_${idx}`"
        >{{ option.text }}</b-form-option>
        <slot></slot>
    </select>
</template>

<script>
    import { formMixin, formStateMixin, formOptionsMixin, formCustomMixin } from '../mixins';
    import { warn } from '../utils';

    export default {
        mixins: [formMixin, formStateMixin, formCustomMixin, formOptionsMixin],
        watch: {
            value(newVal, oldVal)  {
                if (newVal !== oldVal) {
                    this.$emit('input', this.value);
                }
            }
        },
        props: {
            value: {},
            multiple: {
                type: Boolean,
                default: false
            },
            selectSize: {
                // Browsers default size to 0, which shows 4 rows in most browsers in multiple mode
                // Size of 1 can bork out firefox
                type: Number,
                default: 0
            },
            ariaInvalid: {
                type: [Boolean, String],
                default: false
            },
            size: {
                type: String,
                default: null
            }
        },
        computed: {
            inputClass() {
                return [
                    'form-control',
                    this.stateClass,
                    this.size ? `form-control-${this.size}` : null,
                    (this.plain || this.multiple || this.selectSize > 1) ? null : 'custom-select'
                ];
            },
            computedAriaInvalid() {
                if (this.ariaInvalid === true || this.ariaInvalid === 'true') {
                    return 'true';
                }
                return this.stateClass == 'is-invalid' ? 'true' : null;
            }
        }
    };

</script>
