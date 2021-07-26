import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appExpanded]'
})
export class ExpandedDirective {
    @HostBinding('attr.aria-expanded') expanded = false;

    @HostListener('click') toggleExpanded() {
        this.expanded = !this.expanded;
    }

}