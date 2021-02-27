import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'spacer'})
export class SpacerPipe implements PipeTransform {
  transform(value: string): string {
    let string = value;
    string = string.split('_').join(' ');
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}