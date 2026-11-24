import { Pipe, PipeTransform } from '@angular/core';
import { ProdutoRating } from '../models/produto.model';

@Pipe({
  name: 'avaliacaoEstrelas',
  standalone: true,
})
export class AvaliacaoEstrelasPipe implements PipeTransform {
  /**
   * Formata avaliações numéricas ou objetos de rating em estrelas visuais
   * Exemplo de saída: ★★★★☆ (4.2)
   */
  transform(valor: number | ProdutoRating | null | undefined, exibirClassificacao = false): string {
    if (valor === null || valor === undefined) {
      return '☆☆☆☆☆ (0.0)';
    }

    let nota = 0;
    let totalAvaliacoes: number | null = null;

    if (typeof valor === 'number') {
      nota = valor;
    } else if (typeof valor === 'object' && 'rate' in valor) {
      nota = Number(valor.rate) || 0;
      if (typeof valor.count === 'number') {
        totalAvaliacoes = valor.count;
      }
    }

    // Normaliza a nota entre 0 e 5
    const notaClamped = Math.min(5, Math.max(0, nota));
    const estrelasCheias = Math.round(notaClamped);
    const estrelasVazias = 5 - estrelasCheias;

    const estrelasStr = '★'.repeat(estrelasCheias) + '☆'.repeat(estrelasVazias);
    const notaFormatada = notaClamped.toFixed(1);
    const classificacao = notaClamped >= 4.5 ? 'Excelente'
      : notaClamped >= 3.5 ? 'Bom'
      : notaClamped >= 2.5 ? 'Regular'
      : 'Ruim';
    const complemento = exibirClassificacao ? ` - ${classificacao}` : '';

    if (totalAvaliacoes !== null) {
      return `${estrelasStr} (${notaFormatada}${complemento})`;
    }

    return `${estrelasStr} (${notaFormatada}${complemento})`;
  }
}
