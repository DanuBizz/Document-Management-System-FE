import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'app-fab-button',
  standalone: true,
  imports: [MatTooltip, MatIcon, MatMiniFabButton],
  templateUrl: './fab-button.component.html',
  styleUrl: './fab-button.component.scss',
})
export class FabButtonComponent {
  @Input() icon!: string;
  @Input() tooltip: string = '';
  @Input() disabled: boolean = false;

  @Output() OnClick = new EventEmitter<string>();

  emitEvent() {
    this.OnClick.emit();
  }
}
