import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, limit: number) {
    if (value.length > limit) {
      return value.split(' ').slice(0, limit).join(' ') + (value.split(' ').length > limit ? '...' : '');
    }
    return value;
  }

}
