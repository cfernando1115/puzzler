import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisabled]'
})
export class DisabledDirective {
  @HostBinding('disabled') disabled = false;

  @HostListener('click') disableElement() {
    this.disabled = true;
  }

  constructor() { }

}
