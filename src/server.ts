import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ProdutoRating, ItemCarrinho, Produto } from './app/models/produto.model';
import { Usuario } from './app/models/usuario.model';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'StoreHub.sqlite', // Nome do arquivo que será criado
  synchronize: true,
  logging: false,
  entities: [Usuario, Produto, ItemCarrinho, ProdutoRating], // Registre todos os seus models neste array
});

// Executa a inicialização apenas se chamado diretamente (ex: npm run db:init)
const isMain = process.argv[1] && /server(\.ts|\.js)?$/i.test(process.argv[1]);
if (isMain) {
  AppDataSource.initialize()
    .then(() => AppDataSource.destroy())
    .then(() => console.log('Conexão com o SQLite inicializada com sucesso.'))
    .catch((error: unknown) => {
      console.error('Erro ao inicializar o banco SQLite:', error);
      throw error;
    });
}
