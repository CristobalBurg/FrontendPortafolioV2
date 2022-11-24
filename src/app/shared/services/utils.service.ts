import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }


  parseNgbDateToMoment(ngbDate: NgbDate){
    if(!ngbDate) return;
    let date = ngbDate.year + "-" + ngbDate.month + '-' + ngbDate.day;
    return moment(date).format('yyyy-MM-DD');
  }
  parseMomentToNgbDate(date: string){
	let momentDate = moment(date);
	let ngbDate = new NgbDate( momentDate.year() , momentDate.month() , momentDate.date());
	return ngbDate;
  }

  enumerateDaysBetweenDates (startDate, endDate ){
    let date: string[] = []
    while(moment(startDate) <= moment(endDate)){
      date.push(startDate);
      startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
    }
    return date;
  }
}
