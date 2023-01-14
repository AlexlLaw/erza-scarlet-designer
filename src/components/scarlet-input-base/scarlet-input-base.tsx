import { Component, Element, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import * as masks from './mask/masks';
import { validator } from './validators/validators';

@Component({
  tag: 'scarlet-input',
  styleUrl: 'scarlet-input-base.scss',
  shadow: false,
})
export class ScarletInputBase {
  @Element() element!: HTMLElement;

  @Prop({ mutable: true }) public value?: any;
  @Prop({ mutable: true }) public maxlength?: number;
  @Prop({ mutable: true }) public errormessage?: string;

  @Prop({ mutable: true }) public disabled?: boolean = false;
  @Prop({ mutable: true }) public readonly?: boolean = false;
  @Prop({ mutable: true }) public required?: boolean = false;
  @Prop({ mutable: true }) public type?: 'text' | 'number' | 'date' | 'email' | 'password' | 'search' | 'tel' = 'text';
  @Prop({ mutable: true }) public mask?: 'CPF' | 'CNPJ' | 'CEP' | 'CPFCNPJ' | 'CURRENCY' | '' = '';

  @Prop() public idprop?: string;
  @Prop() public name: string;
  @Prop() public label?: string;
  @Prop() public helpermessage?: string;
  @Prop() public iconFilename?: string;
  @Prop() public iconDescription?: string;


  @Event() changed: EventEmitter<UIEvent>;

  public labelText!: HTMLLabelElement;
  public input!: HTMLInputElement;
  public labelClass: string = 'placeholder';


  componentWillLoad() {
    this.validateInputValue(this.value)
    }

  componentDidLoad() {
    if (this.value?.length > 0) {this.setLabelClassOnFocus();}
  }

  handleChange(event: UIEvent): void {

    this.setUnmaskValue(event);
    (event.target as HTMLInputElement).value = this.value
    this.changed.emit(event);
  }

  private setUnmaskValue(event): void {
    this.value = event.target.value;
    this.value = this.maskInputValue.maskedValue;
  }

  private get maskInputValue(): masks.MaskResult {
    return masks.mask(this.mask, this.value);
  }

  @Watch('value')
  private validateInputValue(value: string): void {
    if (!this.mask) return;
    this.errormessage = validator(this.mask, value, this.errormessage).errorMessage;
  }

  private setLabelClassOnFocus(): void {
    this.labelText.className = 'label';
  }

  private unsetLabelClassOnFocus(): void {
    if (!this.input.value) {this.labelText.className = 'placeholder';}
  }

 render() {
  return (
    <div
      class={{
      ['sicredi-input']:true,
      ['-disabled']:this.disabled,
      ['-readonly']:this.readonly,
      ['-invalid']:!this.disabled && !!this.errormessage}}
    >
      <input
        type={this.type}
        class="placeholder"
        placeholder=""
        id={this.idprop}
        name={this.name}
        value={this.maskInputValue.maskedValue}
        required={this.required}
        disabled={this.disabled}
        readonly={this.readonly}
        maxlength={(this.maskInputValue.maxlength && this.maxlength)}
        aria-invalid={!!this.errormessage && !this.disabled}
        aria-readonly={this.readonly ? 'true' : 'false'}
        aria-required={this.required ? 'true' : 'false'}
        aria-disabled={this.disabled ? 'true' : 'false'}
        onInput={(ev:UIEvent) => this.handleChange(ev)}
        onFocus={() => this.setLabelClassOnFocus()}
        onBlur={() => this.unsetLabelClassOnFocus()}
        ref={el => this.input = el}
      />

      {this.iconFilename && this.iconDescription && (
        <span class={'icon'} onClick={!this.readonly ? () => this.input.focus() : null}>
          {/* <diana-icon filename={this.iconFilename} description={this.iconDescription}></diana-icon> */}
        </span>
      )}

      <label class={this.labelClass} ref={el => (this.labelText = el)}>
        {this.label}
      </label>

      <span
        class={{
          ['helper-message']: !this.errormessage,
          ['error-message color-danger']: !!this.errormessage,
        }}
      >
        {this.errormessage}
        {!this.errormessage && this.helpermessage}
        {!this.helpermessage && !this.errormessage && '\u00A0'}
      </span>
    </div>
  );
}

}
