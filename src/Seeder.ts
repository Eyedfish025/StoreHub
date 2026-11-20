import 'reflect-metadata'; // Obrigatório na linha 1 para scripts isolados
import { AppDataSource } from './server'; // Ajuste o caminho se o DataSource estiver em outro arquivo
import { ItemCarrinho, Produto } from './app/models/produto.model';
import { Usuario } from './app/models/usuario.model';

async function executarSeed() {
  try {
    // 1. Abre a conexão com o banco SQLite
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('🔌 Conectado ao banco de dados para seed...');
    }

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const produtoRepo = AppDataSource.getRepository(Produto);
    const carrinhoRepo = AppDataSource.getRepository(ItemCarrinho);

    // Evita duplicar os dados se o banco já estiver populado
    const totalProdutos = await produtoRepo.count();
    if (totalProdutos > 0) {
      console.log('ℹ️ O banco já possui dados cadastrados. Seed ignorado.');
      return;
    }

    // 2. Cria e salva os Usuários
    const usuarios = usuarioRepo.create([
      {
        cpf: '12345678900',
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        endereco: 'Rua A, 123, Cidade X',
        telefone: '123456789',
        senha: 'senha123',
      },
      {
        cpf: '09876543210',
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@example.com',
        endereco: 'Rua B, 456, Cidade Y',
        telefone: '987654321',
        senha: 'senha456',
      },
      {
        cpf: '11122233344',
        nome: 'Carlos Santos',
        email: 'carlos.santos@example.com',
        endereco: 'Rua C, 789, Cidade Z',
        telefone: '555555555',
        senha: 'senha789',
      },
    ]);
    await usuarioRepo.save(usuarios);
    console.log('✅ Usuários salvos!');

    // 3. Cria e salva os Produtos e Ratings
    const produtos = produtoRepo.create([
      {
        title: 'Produto A',
        description: 'Descrição do Produto A',
        price: 10.99,
        image: 'produto-a.jpg',
        category: 'Categoria A',
        rating: {
          rate: 4.5,
          count: 10,
        },
      },
      {
        title: 'Produto B',
        description: 'Descrição do Produto B',
        price: 20.49,
        image: 'produto-b.jpg',
        category: 'Categoria B',
        rating: {
          rate: 3.8,
          count: 5,
        },
      },
      {
        title: 'Produto C',
        description: 'Descrição do Produto C',
        price: 15.75,
        image: 'produto-c.jpg',
        category: 'Categoria C',
        rating: {
          rate: 5.0,
          count: 20,
        },
      },
    ]);
    await produtoRepo.save(produtos);
    console.log('✅ Produtos e avaliações salvos!');

    // 4. Cria e salva os Itens do Carrinho
    const itemCarrinhos = carrinhoRepo.create([
      {
        usuarioid: usuarios[0].id,
        produtoid: produtos[0].id,
        quantidade: 2,
      },
      {
        usuarioid: usuarios[0].id,
        produtoid: produtos[1].id,
        quantidade: 1,
      },
      {
        usuarioid: usuarios[1].id,
        produtoid: produtos[0].id,
        quantidade: 3,
      },
    ]);
    await carrinhoRepo.save(itemCarrinhos);
    console.log('✅ Itens do carrinho salvos!');

  } catch (erro) {
    console.error('❌ Erro ao executar o seed:', erro);
  } finally {
    // 5. Fecha a conexão para liberar o terminal
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔒 Conexão encerrada.');
    }
  }
}

executarSeed();
