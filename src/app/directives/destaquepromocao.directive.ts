import {
  Directive,
  Input,
  OnChanges,
  OnInit,
  HostBinding,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appDestaquePromocao]',
  standalone: true,
})
export class DestaquePromocaoDirective implements OnInit, OnChanges {
  @Input('appDestaquePromocao') preco?: number | null;

  @HostBinding('style.border') border = '';
  @HostBinding('style.boxShadow') boxShadow = '';
  @HostBinding('style.backgroundColor') backgroundColor = '';
  @HostBinding('style.transition') transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  @HostBinding('class.destaque-promocao') isPromocao = false;

  ngOnInit(): void {
    this.aplicarDestaque();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preco']) {
      this.aplicarDestaque();
    }
  }

  private aplicarDestaque(): void {
    const valor = Number(this.preco);
    const emPromocao = !isNaN(valor) && valor > 0 && valor < 50;

    if (emPromocao) {
      this.border = '2px solid #d4af37';
      this.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.25)';
      this.backgroundColor = 'rgba(212, 175, 55, 0.05)';
      this.isPromocao = true;
    } else {
      this.border = '';
      this.boxShadow = '';
      this.backgroundColor = '';
      this.isPromocao = false;
    }
  }
}
