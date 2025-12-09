import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'USD'): string {
    if (!value) return '0.00';
    
    const formatted = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    
    switch(currency) {
      case 'USD':
        return `$${formatted}`;
      case 'PEN':
        return `S/ ${formatted}`;
      default:
        return formatted;
    }
  }
}