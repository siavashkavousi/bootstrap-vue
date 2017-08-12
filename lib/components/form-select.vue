<template>
    <select :class="inputClass"
            :name="name"
            :id="id || null"
            v-model="localValue"
            :multiple="multiple || null"
            :size="(multiple || selectSize > 1) ? selectSize : null"
            :disabled="disabled"
            :required="required"
            :aria-required="required ? 'true' : null"
            :aria-invalid="ariaInvalid"
            ref="input"
    ><slot></slot></select>
</template>

<script>
    import { formMixin, formCustomMixin } from '../mixins';
    import { warn } from '../utils';

    export default {
        mixins: [formMixin, formCustomMixin],
        data() {
            return {
                localValue: this.multiple ? (this.value || []) : this.value
            };
        },
        props: {
            value: {},
            invalid: {
                type: [Boolean, String],
                default: false
            },
            size: {
                type: String,
                default: null
            },
            multiple: {
                type: Boolean,
                default: false
            },
            selectSize: {
                // Browsers default size to 0, which typically shows 4 rows in most browsers
                // Size of 1 can bork out firefox!!!
                type: Number,
                default: 0
            }
        },
        computed: {
            inputClass() {
                return [
                    'form-control',
                    this.size ? `form-control-${this.size}` : null,
                    (this.plain || this.multiple || this.selectSize > 1) ? null : 'custom-select'
                ];
            },
            ariaInvalid() {
                if (this.invalid === true || this.invalid === 'true') {
                    return 'true';
                }
                return null;
            }
        },
        watch: {
            value(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.lcoalValue = this.multiple ? (newVal || []) : newVal;
                }
            },
            localValue(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.$emit('input', newVal);
                }
            }
        }
    };
</script>
