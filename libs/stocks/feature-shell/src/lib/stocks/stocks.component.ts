import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { string } from 'joi';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  destroySubject$: Subject<void> = new Subject();

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      dateFrom: [null, []],
      dateTo: [null, []]
    }, {validator: this.dateValidator('dateFrom', 'dateTo')});
    this.onChanges();
  }

  dateValidator(from, to) {
    return (form: FormGroup): { [key: string]: any } => {
      const dateFrom = form.controls[from];
      const dateTo = form.controls[to];
      return dateFrom.value > dateTo.value ? { 'invalidInputDate': true} : {};
    }
  }
  onChanges(){
    this.stockPickerForm.valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(form => {
      if (form.dateFrom > form.dateTo && form.dateTo && form.dateFrom) {
        this.stockPickerForm.setValue({
          ...form,
          dateTo: form.dateFrom,
          });
      }
    });
  }



  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      let { period } = this.stockPickerForm.value;
      const { symbol, dateTo, dateFrom} = this.stockPickerForm.value;
      period = dateTo && dateFrom ? 'max' : period;
      this.priceQuery.fetchQuote(symbol, period, dateFrom, dateTo);
    }
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }
}
