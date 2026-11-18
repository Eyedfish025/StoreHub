import sqlite3 from 'sqlite3';
import { DataSource } from 'typeorm';
import { ProdutoRating, ItemCarrinho, Produto } from './app/models/produto.model';
import { Usuario } from './app/models/usuario.model';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'StoreHub.sqlite', // Nome do arquivo que será criado
  synchronize: true,
  logging: true,
  entities: [Usuario, Produto, ItemCarrinho, ProdutoRating], // Registre todos os seus models neste array
});