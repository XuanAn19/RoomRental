import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() loginClicked = new EventEmitter<boolean>();
  isButtonActive = false;

  onLoginClick() {
    this.loginClicked.emit(true);
    this.isButtonActive = true;
}
