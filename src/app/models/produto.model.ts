import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne, ManyToOne, JoinColumn} from 'typeorm';
import { Usuario } from './usuario.model';

@Entity('produto_ratings')
export class ProdutoRating {

  @PrimaryColumn({type: 'integer'})
  produtoid!: number;

  @OneToOne(() => Produto, (produto) => produto.rating, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produtoid' })
  produto!: Produto;

  @Column({ type: 'real' })
  rate!: number;

  @Column({ type: 'integer' })
  count!: number;
}

@Entity('Produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'text'})
  title!: string;

  @Column({ type: 'real' })
  price!: number;
  
  @Column({type: 'text'})
  description!: string;

  @Column({type: 'text'})
  category!: string;

  @Column({type: 'text'})
  image!: string;

  @OneToOne(() => ProdutoRating, (rating) => rating.produto, { cascade: true })
  rating!: ProdutoRating;
}

@Entity('ItemCarrinho')
export class ItemCarrinho {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'integer'})
  produtoid!: number;

  @Column({ type: 'integer' })
  usuarioid!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.itensCarrinho, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioid' })
  usuario!: Usuario;

  @ManyToOne(() => Produto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produtoid' })
  produto!: Produto;

  @Column({ type: 'integer' })
  quantidade!: number;
}
