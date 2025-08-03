import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'go-back',
  imports: [],
  templateUrl: './go-back.html',
  styleUrl: './go-back.scss'
})
export class GoBack {
  constructor(private router: Router) {
  }

  ngOnInit() {}

  ngOnDestroy() {}

  goBack() {
    this.router.navigate(['/products']);
  }
}
