import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from "@angular/core";


@Directive({
    selector:'[appDropdown]'
})
export class DropdownDirective {
    // @Input() dropdownSelectedClass: string = 'btn-group open';
    // @Input() dropdownClosedClass: string = 'btn-group';

    // @HostBinding('class') boostrapClass: string;

    // constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    // ngOnInit() {
    //     this.boostrapClass = this.dropdownClosedClass;
    // }

    // @HostListener('click') mouseclick(eventData: Event) {
    //     if (this.boostrapClass === this.dropdownClosedClass) 
    //         this.boostrapClass = this.dropdownSelectedClass
    //     else
    //         this.boostrapClass = this.dropdownClosedClass
    // }

    @HostBinding('class.open') isOpen = false;

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? 
        !this.isOpen : false;
    }

    constructor(private elRef: ElementRef) {}
}