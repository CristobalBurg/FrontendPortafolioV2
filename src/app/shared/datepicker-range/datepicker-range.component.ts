import { Component, HostListener } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
	selector: 'ngbd-datepicker-range',
	templateUrl: './datepicker-range.component.html',
	styles: [
		`
			.custom-day {
				text-align: center;
				padding: 0.185rem 0.25rem;
				display: inline-block;
				height: 2rem;
				width: 2rem;
			}
			.custom-day.focused {
				background-color: green;
			}
			.custom-day.range,
			.custom-day:hover {
				background-color: green;
				color: white;
			}
			.custom-day.faded {
				background-color: LimeGreen ;
			}
      .custom-day.day-disabled {
      color: lightgrey;
    }
    .custom-day.day-disabled:hover {
      background-color: transparent;
    }
		`,
	],
})
export class NgbdDatepickerRange {
	hoveredDate: NgbDate | null = null;
  minDate: NgbDateStruct; 
  w: number;
	fromDate: NgbDate ;
	toDate: NgbDate | null = null;
  date: {year: number, month: number, day:number};
  @Output() selectedDateEmitter = new EventEmitter<any>();
  

  isDisabled = (date: NgbDateStruct)=> {
    return this.disabledDates.find(x => NgbDate.from(x)?.equals(date))? true: false;
  }

  disabledDates: NgbDateStruct[] = [ 
    {year: 2022, month:11, day:20},
    {year: 2022, month:11, day:21},
    {year: 2022, month:11, day:22},
  ]
  parsedDisabledDates: string[] = []

	constructor(private calendar: NgbCalendar) {
    this.w = window.innerWidth;
    this.minDate = this.getMinDate();
		this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
	}

@HostListener('window:resize', ['$event'])
onResize() {
  this.w = window.innerWidth;
}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
    let parsed = this.disabledDates.map( (x => NgbDate.from(x))) as NgbDate[];
    let momentArray = parsed.map( (x) => this.parseNgbDateToMoment(x))
    let inicio = this.parseNgbDateToMoment(this.fromDate);
    let fin = this.parseNgbDateToMoment(this.toDate as NgbDate);
    let rangoFechas = { inicio,fin }
    let checks:boolean[] = []

    momentArray.forEach( (disabledDate) => {
      let isEnabled = rangoFechas.fin && !( moment(disabledDate).isBetween(moment(inicio),moment(fin)))
      if(isEnabled){
        checks.push(true)
      }
    })

    if (checks.length == momentArray.length){
      this.emitSelectedDate(rangoFechas)
    } else {
      this.emitSelectedDate(null)
    }
	}



  parseNgbDateToMoment(ngbDate: NgbDate){
    if(!ngbDate) return;
    let date = ngbDate.year + "-" + ngbDate.month + '-' + ngbDate.day;
    return moment(date).format('yyyy-MM-DD');
  }

  emitSelectedDate(selectedDate: any){
    this.selectedDateEmitter.emit(selectedDate)
  }

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  getMinDate(){
    return  { day: moment().date(), month: moment().month() + 1, year: moment().year()};
    }
}