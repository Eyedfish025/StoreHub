import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemCarrinho } from './produto.model';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  cpf!: string;

  @Column({type: 'text'})
  nome!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({type: 'text'})
  senha!: string;

  @Column({ type: 'text' })
  telefone!: string;

  @Column({ type: 'text' })
  endereco!: string;

  @OneToMany(() => ItemCarrinho, (item) => item.usuario)
  itensCarrinho!: ItemCarrinho[];
}