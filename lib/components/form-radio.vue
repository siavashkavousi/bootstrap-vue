<!-- Creates Single radio input -->
<template>
    <label :class="labelClasses">
        <input v-model="localChecked"
               :id="safeId"
               :class="inputClasses"
               :value="value"
               :name="get_Name"
               :required="get_Name && get_Required"
               :disabled="is_Disabled"
               ref="radio"
               type="radio"
               autocomplete="off"
               @focus="handleFocus"
               @blur="handleFocus"
        >
        <span v-if="is_Custom && !is_ButtonMode" class="custom-control-indicator" aria-hidden="true"></span>
        <span :class="(is_Custom && !is_ButtonMode) ? 'custom-control-description' : null">
            <slot></slot>
        </span>
    </label>
</template>

<script>
    // TODO: create form-control mixin for ID, name, etc and common props (state, etc)
    import { formMixin, idMixin, formCustomMixin } from '../mixins';
    export default {
        mixins: [formMixin, formCustomMixin],
        data() {
            return {
                // This could be in form-check-radio mixin
                localChecked: this.checked
            };
        },
        model: {
            // could be in form-check-radio mixin
            prop: 'checked',
            event: 'input'
        },
        props: {
            // could be in form-check-radio mixin
            checked: {},
            // could be in form-check-radio mixin
            stacked: {
                type: Boolean,
                default: false
            },
            // could be in form-check-radio mixin
            button: {
                // Render as button style
                type: Boolean,
                default: false
            },
            // could be in form-check-radio mixin
            buttonVariant: {
                // Only applicable when rendered with button style
                type: String,
                default: 'secondary'
            }
        },
        watch: {
            // Radio Groups can only have one final value, so our wathers are simple
            checked(newVal, oldVal) {
                this.localChceked = newVal;
            },
            localChceked(newVal, oldVal) {
                this.$emit('input',this.localChceked);
            }
        },
        computed: {
            // TODO: Make recursive/looping prop to find formContainer/formCheckRadioContaier

            // form-mixin
            is_FormChild() {
                return Boolen(this.$parent && this.$parent.is_FormContainer);
                // b-form-row, b-form-group, b-form are all FormContainers
                // They will need to have is_FormContainer set to true
                // We also may want to make this recursive ? to handle intermediate components?
            },
            is_Disabled() {
                // Child can be disabled while parent isn't
                return Boolean((this.is_FormChild && this.$parent.is_Disabled) || this.disabled);
            },
            get_FormVm() {
                if (this.$el.tagName === 'FORM') {
                    return this;
                }
                return this.is_FormChild ? this.$parent.get_FormVm : null;
            },
            // Form-custom mixin
            is_Plain() {
                return Booloean(this.is_FormChild ? this.$parent.is_Plain : this.plain);
            },
            is_Custom() {
                return !this.is_Plain;
            },
            // Form-size-mixin
            get_Size() {
                // This could be added to form-size mixin
                // Child can override parent variant
                return this.is_FormChild ? (this.size || this.$parent.get_Size) : this.size;
            },
            // form-state mixin
            get_State() {
                // This could be added to form-state mixin
                // This is a tri-state prop (true, false, null)
                // TODO: This needs to be revamped to handle tri-state properly
                // because null and false both evalulate loosely to false
                if (this.is_FormChild) {
                    return typeof this.state === 'boolean' ? this.state : this.$parent.getState || null;
                } else {
                    return this.state;
                }
            },
            // radio / Checkbox only params form-check-radio mixin
            is_FormCheckRadioChild() {
                return Boolen(this.$parent && this.$parent.is_FormCheckRadioContainer);
                // b-form-radios and b-form-checkboxes ara all FormCheckRadioContainers
                // They will need to have is_FormCheckRadioContainer set to true
                // TODO: We also may want to make this recursive/while loop ? to handle intermediate components?
            },
            is_Stacked() {
                return Boolean(this.is_FormCheckRadioChild ? this.$parent.is_Stacked : this.stacked);
            },
            is_Inline() {
                return !this.is_Stacked;
            },
            is_ButtonMode() {
                // this.buttonVariant only applies to radios & checkboxes
                return Boolean((this.is_FormChild && this.$parent.is_ButtonMode) || this.buttons || this.button);
            },
            get_ButtonVariant() {
                if (this.is_FormCheckRadioChild) {
                    // IF we are a child of a form component, we must explicity set button mode to
                    // get local buttonVariant to apply, so otherwise we use parent's variant by deafult
                    return (this.button || this.buttons) ? this.butonVariant : this.$parent.get_ButtonVariant;
                }
                // Not a formCheckRadioChild, so we just go aheadand user local variant name
                return this.buttonVariant || null;
            },
            get_Name() {
                // limit this to radio/check wrappers
                return (this.isFormChild ? this.$parent.get_Name : this.name) || null;
            },
            // Local computed props
            isChecked() {
                return this.value === this.localChecked;
            },
            inputClasses() {
                return [
                    (this.is_Custom && !this.is_ButtonMode) ? 'custom-control-input' : null;
                ];
            },
            labelClasses() {
                if (this.is_ButtonMode) {
                    return [
                        'btn',
                        `btn-${this.getButtonVariant}`,
                        // Fix stacking issue (remove space between buttons, specifically the last one)
                        this.is_Stacked ? 'mb-0' : ''
                        // 'disabled' class makes "button" look disabled
                        this.is_Disabled ? 'disabled' : '',
                        // 'active' class makes "button" look pressed
                        this.isChecked ? 'active' : null
                    ];
                }
                return [
                    this.is_Custom ? 'custom-control' : '',
                    this.is_Custom ? 'custom-radio' : null,
                    this.is_Inline ? 'form-check-inline' : ''
                ];
            }
        },
        methods: {
            handleFocus(evt) {
                // When in buttons mode, we need to add 'focus' class to label when radio focused
                if (this.is_ButtonMode && evt.target && evt.target.parentElement) {
                    const labelClassList = evt.target.parentElement.classList;
                    if (evt.type ==='focus') {
                        labelclassList.add('focus');
                    } else if (evt.type ==='blur') {
                        labelclassList.remove('focus');
                    }
                }
            }
        }
    };
</script>
