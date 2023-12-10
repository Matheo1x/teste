const express = require('express');
const app = express();
app.use(express.json());


let clientes = [
  { id: 1, nome: 'Matheus', email: 'matheus@hotmail.com' },
  { id: 2, nome: 'Luis Alan', email: 'luisalan@gmail.com' },
  { id: 3, nome: 'Luis Vinicius', email: 'luisvinicius@outlook.com' },
  { id: 4, nome: 'Marlon', email: 'marlon@terra.com' },
  { id: 5, nome: 'Maicon Jecson', email: 'maiconjecson@yahoo.com' }
];

let produtos = [
  { id: 1, nome: 'feijao', preco: 3.50, estoque: 120 },
  { id: 2, nome: 'arroz', preco: 3.30, estoque: 119 },
  { id: 3, nome: 'acucar', preco: 3.10, estoque: 9 },
  { id: 4, nome: 'cafe', preco: 2.90, estoque: 90 },
  { id: 5, nome: 'agua', preco: 2, estoque: 200 },
  { id: 6, nome: 'carne', preco: 35, estoque: 80 },
  { id: 7, nome: 'frango', preco: 13, estoque: 75 },
  { id: 8, nome: 'sardinha', preco: 8, estoque: 50 },
  { id: 9, nome: 'biscoito', preco: 4, estoque: 35 },
  { id: 10, nome: 'pilha', preco: 3, estoque: 5 }
];

let vendas = [
  { id: 1, produto: "agua", cliente: 1, quantidade: 15 },
  { id: 2, produto: "pilha", cliente: 2, quantidade: 2 },
  { id: 3, produto: "carne", cliente: 3, quantidade: 6 }, 
  { id: 4, produto: "acucar", cliente: 4, quantidade: 5 },
  { id: 5, produto: "cafe", cliente: 5, quantidade: 2 }, 
];


//CRUD de clientes
app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.get('/clientes/:id', (req, res) => {
  const cliente = clientes.find(c => c.id === parseInt(req.params.id));
  if (!cliente) return res.status(404).send('Cliente não encontrado.');
  res.json(cliente);
});

let ultimoIdCliente = 5; 
app.post('/clientes', (req, res) => {
  const novoCliente = req.body;
  novoCliente.id = ++ultimoIdCliente;
  clientes.push(novoCliente);
  res.status(201).json(novoCliente);
});

app.put('/clientes/:id', (req, res) => {
  const cliente = clientes.find(c => c.id === parseInt(req.params.id));
  if (!cliente) return res.status(404).send('Cliente não encontrado.');

  cliente.nome = req.body.nome || cliente.nome;
  cliente.email = req.body.email || cliente.email;

  res.json(cliente);
});

app.delete('/clientes/:id', (req, res) => {
  clientes = clientes.filter(c => c.id !== parseInt(req.params.id));
  res.status(204).send();
});


//CRUD de produtos
  app.get('/produtos', (req, res) => {
    res.json(produtos);
  });
  
  app.get('/produtos/:id', (req, res) => {
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).send('Produto não encontrado.');
    res.json(produto);
  });
  
  let ultimoIdProduto = 10;
  app.post('/produtos', (req, res) => {
    const novoProduto = req.body;
    novoProduto.id = ++ultimoIdProduto;
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
  });
  
  app.put('/produtos/:id', (req, res) => {
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).send('Produto não encontrado.');
  
    produto.nome = req.body.nome || produto.nome;
    produto.preco = req.body.preco || produto.preco;
    produto.estoque = req.body.estoque || produto.estoque;
  
    res.json(produto);
  });

  app.delete('/produtos/:id', (req, res) => {
    produtos = produtos.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).send();
  });
  

//CRUD de vendas
app.get('/vendas', (req, res) => {
  res.json(vendas);
});

let ultimoIdVenda = 4;
app.post('/vendas', (req, res) => {
  const novaVenda = req.body;
  novaVenda.id = ++ultimoIdVenda;
  vendas.push(novaVenda);
  res.status(201).json(novaVenda);
});

app.get('/vendas/:id', (req, res) => {
    const venda = vendas.find(v => v.id === parseInt(req.params.id));
    if (!venda) return res.status(404).send('Venda não encontrada.');
    res.json(venda);
  });
  
  app.put('/vendas/:id', (req, res) => {
    const venda = vendas.find(v => v.id === parseInt(req.params.id));
    if (!venda) return res.status(404).send('Venda não encontrada.');
  
    venda.produto = req.body.produto || venda.produto;
    venda.cliente = req.body.cliente || venda.cliente;
    venda.quantidade = req.body.quantidade || venda.quantidade;
  
    res.json(venda);
  });
  
  app.delete('/vendas/:id', (req, res) => {
    vendas = vendas.filter(v => v.id !== parseInt(req.params.id));
    res.status(204).send();
  });

  
  // Geracao de relatorios
  // Geracao de relatorio de produtos mais vendido
  app.get('/relatorios/produtos-mais-vendidos', (req, res) => {

    const produtosVendidos = {};
    vendas.forEach(venda => {
      if (produtosVendidos[venda.produto]) {
        produtosVendidos[venda.produto] += venda.quantidade;
      } else {
        produtosVendidos[venda.produto] = venda.quantidade;
      }
    });
  
    const produtosMaisVendidos = Object.entries(produtosVendidos)
      .sort(([, quantidadeA], [, quantidadeB]) => quantidadeB - quantidadeA)
      .map(([produto, quantidade]) => ({ produto, quantidade }));
  
    res.json(produtosMaisVendidos);
  });
  
  // Geracao de relatorio de produto por cliente
  app.get('/relatorios/produto-por-cliente/:idCliente', (req, res) => {
    const idCliente = parseInt(req.params.idCliente);
    
    const vendasCliente = vendas.filter(venda => venda.cliente === idCliente);
    
    const produtosPorCliente = vendasCliente.map(venda => {
      const cliente = clientes.find(c => c.id === idCliente);
      return {
        cliente: cliente.nome,
        produto: venda.produto,
        quantidade: venda.quantidade
      };
    });
  
    res.json(produtosPorCliente);
  });


  //Geracao de relatorio de consumo médio do cliente
app.get('/relatorios/consumo-medio-cliente', (req, res) => {
  const consumoMedioCliente = {};

  vendas.forEach(venda => {
    const cliente = clientes.find(c => c.id === venda.cliente);

    if (cliente) {
      const valorTotalVenda = venda.valorTotal || 0;
      const quantidadeProdutos = venda.quantidade || 0;

      if (!consumoMedioCliente[cliente.nome]) {
        consumoMedioCliente[cliente.nome] = {
          totalValor: valorTotalVenda,
          totalQuantidade: quantidadeProdutos,
          quantidadeVendas: 1,
        };
      } else {
        consumoMedioCliente[cliente.nome].totalValor += valorTotalVenda;
        consumoMedioCliente[cliente.nome].totalQuantidade += quantidadeProdutos;
        consumoMedioCliente[cliente.nome].quantidadeVendas++;
      }
    }
  });

  // Calcular a media de consumo para cada cliente
  Object.keys(consumoMedioCliente).forEach(cliente => {
    const consumo = consumoMedioCliente[cliente];
    consumoMedioCliente[cliente].media = (consumo.totalValor / consumo.totalQuantidade).toFixed(2);
  });

  res.json(consumoMedioCliente);
});


  // Geracao de relatorio de produto com baixo estoque.
  app.get('/relatorios/produto-baixo-estoque', (req, res) => {
    const estoqueMinimo = 10; // Limite de estoque mínimo
  
    const produtosBaixoEstoque = produtos.filter(produto => produto.estoque < estoqueMinimo);
  
    res.json(produtosBaixoEstoque);
  });
  

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
