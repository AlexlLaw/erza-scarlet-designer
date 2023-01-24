import { Component, Prop, Element, h, Host } from "@stencil/core";
import { Icons } from "../../assets/icons/1.3.0";

@Component({
  tag: 'scarlet-icon',
  styles: 'scarlet-icon { display: flex}',
  shadow: false,
})
export class ScarletIcon {
  @Prop() public color?: string;
  @Prop() public description?: string;
  @Prop() public filename?: string;
  @Element() public iconElement: HTMLScarletIconElement;
  private iconSize: string;

  private getIconSize(): string {
    return this.filename.split('_')[1];
  }

  private getAndInsertIconSvg(): void {
    this.iconElement.innerHTML = Icons[this.filename] ? Icons[this.filename] : 'Icone não encontrado';
    console.log(this.iconElement.innerHTML);

    const iconSvgPath = this.iconElement.querySelector('path');

    if (this.color && iconSvgPath) {
      iconSvgPath.setAttribute('fill', this.color);
    }
  }

  private ensureAccessibility(): void {
    const iconSvg = this.iconElement.querySelector('svg');

    if (this.description && iconSvg) {
      iconSvg.setAttribute('role', 'img');

      const arialLabelIdRandom = this.filename + `-${Date.now()}`;
      iconSvg.setAttribute('aria-labelleby', arialLabelIdRandom);

      const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleElement.id = arialLabelIdRandom;
      titleElement.innerHTML = this.description;

      iconSvg.prepend(titleElement);
    }
  }

  render() {
    this.iconSize = this.filename ? this.getIconSize() : '24';

    if (this.filename) {
      this.getAndInsertIconSvg();
      this.ensureAccessibility();
    }

    return <Host
              title={this.description}
              role="img"
              style={{ heigth: this.iconSize + 'px'}}>
            </Host>;
  }
}
