import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appShow]'
})
export class ShowDirective{

    constructor(private renderer: Renderer2, private hostEl: ElementRef) { }

    @HostListener('click') toggleShow() {
        const list = this.hostEl.nativeElement.parentNode.querySelector('.show-me');

        if (list.classList.contains('show')) {
            this.renderer.removeClass(list, 'show');
        }
        else {
            this.renderer.addClass(list, 'show');
        }
    }
}