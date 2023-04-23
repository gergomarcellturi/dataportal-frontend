import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'DPInput',
  templateUrl: './dp-input.component.html',
  styleUrls: ['./dp-input.component.css']
})
export class DpInputComponent implements OnInit {

  @Input() icon: string = '';
  @Input() value?: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  input(data: any) {
    const {value} = data;
    this.valueChange.emit(value);
  }

}
