import {Component, Input, OnInit} from '@angular/core';
import {Color} from "../../../model/types/types";

@Component({
  selector: 'DPButton',
  templateUrl: './dp-button.component.html',
  styleUrls: ['./dp-button.component.css']
})
export class DpButtonComponent implements OnInit {

  public classList: string[] = [];

  @Input() icon?: string;
  @Input() id?: string;
  @Input() disabled?: boolean;
  @Input() type: 'button' | 'submit' | 'reset' = 'submit';
  @Input() iconSize: 'small' | 'normal' = 'small';
  @Input() className: string = '';
  @Input() borderless = false;
  @Input() appearance: 'success' | 'primary' | 'secondary' | 'danger' | 'warning' | 'info' = 'primary'
  constructor() {
  }

  ngOnInit(): void {
    this.classList.push('dp-button');
    if (this.className) this.classList.push(this.className);
    this.classList.push(this.appearance);
  }
  public onClick(event: Event): void {
    if (this.disabled) event.stopPropagation();
  }
}
