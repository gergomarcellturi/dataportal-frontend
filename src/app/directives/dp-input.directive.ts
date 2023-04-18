import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[DPInput]'
})
export class DpInputDirective {

  constructor(
    private el: ElementRef
  ) {

  }

}
