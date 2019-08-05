import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getAllPriceQueries } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';
import { parse } from 'date-fns';

@Injectable()
export class PriceQueryFacade {
  dateFrom: Date;
  dateTo: Date;
  selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));

  priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(pricedQueries => {
      return this.dateFrom && this.dateTo ?
        pricedQueries.filter(priceQuery => priceQuery.dateNumeric >= parse(this.dateFrom).getTime() && priceQuery.dateNumeric <= parse(this.dateTo).getTime()) :
        pricedQueries;
    }),
    map(priceQueries =>
      priceQueries.map(priceQuery => [priceQuery.date, priceQuery.close]))
  );

  constructor(private store: Store<PriceQueryPartialState>) {}

  fetchQuote(symbol: string, period: string, dateFrom: Date, dateTo: Date) {
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.store.dispatch(new FetchPriceQuery(symbol, period, dateFrom, dateTo));
  }
}
