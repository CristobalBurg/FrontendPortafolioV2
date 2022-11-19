import { Component, HostListener, OnInit } from '@angular/core';
import { Usuario } from 'src/app/shared/interfaces/auth.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  w: number;
  currentUser: Usuario

  constructor(private authService:AuthService) { 
    this.w = window.innerWidth;


  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }


@HostListener('window:resize', ['$event'])
onResize() {
  this.w = window.innerWidth;
}

}
