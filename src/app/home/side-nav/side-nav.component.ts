import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  @Output() sideNav = new EventEmitter<boolean>();
  hideSideNav = false;

  onToggleSideNav(){
    this.hideSideNav = !this.hideSideNav;
    this.sideNav.emit(this.hideSideNav);
  }
  
}
