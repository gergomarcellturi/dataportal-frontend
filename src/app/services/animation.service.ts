import {ChangeDetectorRef, ElementRef, EventEmitter, Injectable, QueryList} from '@angular/core';
import {id} from "../consts/misc";
import {GlobalService} from "./global.service";

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  public leaveAnimation: null | 'fade' = null;
  public $stateChange: EventEmitter<'fade' | null> = new EventEmitter<'fade' | null>();

  private elementNums: {compId: number, length: number}[] = [];

  public get delay() {
    return Math.min(this.elementNums.reduce((acc, val) =>
      acc += val.length , 0) * 150 + 600, 1500);
  }

  constructor(
  ) { }

  public add = (elements: QueryList<ElementRef>, component: any) => {
    const compId = id(component);
    const {length} = elements;
    const foundElement = this.elementNums.find(val => val.compId === compId);

    if (foundElement) {
      foundElement.length = length;
    } else {
      this.elementNums = [...this.elementNums, {compId, length}]
    }
  }

  public destroy = (component: any) => {
    const compId = id(component);
    this.elementNums = this.elementNums.filter(el => el.compId !== compId);
  }

  public animate = async (): Promise<void> => {
    this.leaveAnimation = 'fade'
    this.$stateChange.emit('fade');
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.$stateChange.emit(null);
        this.leaveAnimation = null;
        resolve();
      }, this.delay);
    });
  }
}
