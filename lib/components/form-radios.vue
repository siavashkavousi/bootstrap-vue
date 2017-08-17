<template>
    <div :id="localId || null"
         :class="groupClasses"
         role="radiogroup"
         tabindex="-1"
         :data-toggle="buttons ? 'buttons' : null"
         :aria-required="required ? 'true' : null"
         :aria-invalid="computedAriaInvalid"
    >
        <slot name="first"></slot>
        <b-form-radio v-for="(option, idx) in formOptions"
                 v-model="localChecked"
                 ref="options"
                 :id="localId ? `${localId}_BV_radio_${idx}_opt_` : null"
                 :name="name"
                 :value="option.value"
                 :required="name && required"
                 :disabled="option.disabled"
                 :key="`radio_${idx}`"
        ><span v-html="option.text"></span></b-form-radio>
        <slot></slot>
    </div>
</template>

<script>
    import { formMixin, idMixin, formOptionsMixin, formSizeMixin, formStateMixin, formCustomMixin } from '../mixins';
    import bFormRadio from './form-radio.vue';

    export default {
        mixins: [formMixin, idMixin, formSizeMixin, formStateMixin, formCustomMixin, formOptionsMixin],
        components: [bFormRadio],
        data() {
            return {
                localChecked: this.checked
              };
        },
        model: {
            prop: 'checked',
            event: 'input'
        },
        props: {
            checked: {
                type: [String, Object],
                default: null
            },
            validated: {
                type: Boolean,
                default: false
            },
            ariaInvalid: {
                type: [Boolean, String],
                default: false
            },
            stacked: {
                type: Boolean,
                default: false
            },
            buttons: {
                // Render as button style
                type: Boolean,
                default: false
            },
            buttonVariant: {
                // Only applicable when rendered with button style
                type: String,
                default: 'secondary'
            }
        },
        watch: {
            checked(newVal, oldVal) {
                this.localChecked = this.checked;
            },
            localChecked(newVal, oldVal) {
                this.$emit('input', newVal);
            }
        },
        computed: {
            groupClasses() {
                if (this.is_ButtonMode) {
                    return [
                        'btn-group',
                        this.sizeClass,
                        this.stacked ? 'btn-group-vertical' : ''
                        this.validated ? `was-validated` : ''
                    ];
                }
                return [
                    this.sizeClass,
                    this.stacked ? 'custom-controls-stacked' : ''
                    this.validated ? `was-validated` : ''
               ];
            },
            computedAriaInvalid() {
                if (this.ariaInvalid === true || this.AriaInvalid === 'true') {
                    return 'true'
                }
                return this.stateClass === 'is-invalid' ? 'true' : null;
            }
        }
    };
</script>
