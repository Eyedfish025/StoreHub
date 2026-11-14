import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumoTexto',
  standalone: true,
})
export class ResumoTextoPipe implements PipeTransform {
  /**
   * Trunca títulos e descrições longas de forma limpa
   * @param valor Texto a ser truncado
   * @param limite Quantidade máxima de caracteres (padrão: 60)
   * @param sufixo Sufixo anexado quando truncado (padrão: '...')
   */
  transform(
    valor: string | null | undefined,
    limite: number = 60,
    sufixo: string = '...'
  ): string {
    if (!valor) {
      return '';
    }

    const texto = valor.trim();
    if (texto.length <= limite) {
      return texto;
    }

    return texto.substring(0, limite).trim() + sufixo;
  }
}
