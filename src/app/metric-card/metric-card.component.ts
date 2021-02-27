import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css']
})
export class MetricCardComponent implements OnInit {

  @Input('name') name;
  @Input('value') value;
  @Input('icon') icon;


  constructor() { 
    this.name = "Order value"
    this.value = 123123123;
    this.icon = "power";
  }

  ngOnInit(): void {
  }

}
