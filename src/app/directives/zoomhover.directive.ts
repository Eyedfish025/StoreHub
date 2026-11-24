import {
  Directive,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appZoomHover]',
  standalone: true,
})
export class ZoomHoverDirective {
  @Input('appZoomHover') escalaCustomizada?: number;

  @HostBinding('style.transition') transition =
    'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease';
  @HostBinding('style.transform') transform = 'scale(1)';
  @HostBinding('style.willChange') willChange = 'transform';
  @HostBinding('style.zIndex') zIndex = '1';

  @HostListener('mouseenter')
  @HostListener('touchstart')
  onMouseEnter(): void {
    const escala = this.escalaCustomizada || 1.03;
    this.transform = `scale(${escala})`;
    this.zIndex = '5';
  }

  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onMouseLeave(): void {
    this.transform = 'scale(1)';
    this.zIndex = '1';
  }
}
