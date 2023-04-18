import { Component, OnInit } from '@angular/core';
import {fadeOutOnLeave} from "../../../consts/animations";

@Component({
  selector: 'app-data-edit',
  templateUrl: './data-edit.component.html',
  styleUrls: ['./data-edit.component.css'],
  animations: [fadeOutOnLeave]
})
export class DataEditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
