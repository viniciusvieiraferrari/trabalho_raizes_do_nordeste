// ===== ESTADO =====
 const carrinho = [];
 let pagSel = 0;
 let statusAtual = 2; // 0-based index
 let pontosAcumulados = 620; // pontos iniciais do programa de fidelidade

 // ===== NAVEGAÇÃO =====
 function irPara(id) {
     document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
     document.getElementById('tela-' + id).classList.add('ativa');
     document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
     const map = {
         login: 0,
         cardapio: 1,
         pedido: 2,
         status: 3,
         fidelidade: 4,
         totem: 5
     };
     document.querySelectorAll('.nav-btn')[map[id]]?.classList.add('active');
     if (id === 'pedido') renderPedido();
     const isTotem = id === 'totem';
     document.querySelector('.nav-top').style.display = isTotem ? 'none' : '';
     document.querySelector('.app-container').style.background = isTotem ? 'transparent' : '';
     window.scrollTo(0, 0);
 }


 // ===== CARDÁPIOS POR UNIDADE =====
 const cardapios = {
   'Fortaleza – Centro': {
     promo: 'Combo Nordestino com 20% OFF hoje!',
     categorias: [
       {
         nome: 'Lanches',
         icone: '',
         produtos: [
           { nome: 'Tapioca da Serra',   preco: 14.90, svg: 'tapioca'  },
           { nome: 'Baião Burger',        preco: 22.90, svg: 'burger'   },
           { nome: 'Carne de Sol Wrap',   preco: 19.90, svg: 'wrap'     },
           { nome: 'Macaxeira Frita',     preco: 11.90, svg: 'macaxeira'},
         ]
       },
       {
         nome: 'Bebidas',
         icone: '',
         produtos: [
           { nome: 'Suco de Umbú',  preco: 8.90, svg: 'suco' },
           { nome: 'Água de Coco',  preco: 7.90, svg: 'coco' },
           { nome: 'Cajuína',       preco: 6.90, svg: 'cajuina' },
         ]
       }
     ]
   },
   'Recife – Boa Viagem': {
     promo: 'Moqueca do Chef com 15% OFF no almoço!',
     categorias: [
       {
         nome: 'Pratos',
         icone: '',
         produtos: [
           { nome: 'Moqueca de Peixe',    preco: 32.90, svg: 'moqueca'  },
           { nome: 'Baião de Dois',        preco: 24.90, svg: 'baiao'    },
           { nome: 'Acarajé Recifense',    preco: 17.90, svg: 'acaraje'  },
           { nome: 'Xinxim de Galinha',    preco: 28.90, svg: 'xinxim'   },
         ]
       },
       {
         nome: 'Bebidas',
         icone: '',
         produtos: [
           { nome: 'Suco de Maracujá', preco: 9.90, svg: 'suco' },
           { nome: 'Água de Coco',     preco: 7.90, svg: 'coco' },
           { nome: 'Caldo de Cana',    preco: 8.50, svg: 'caldo' },
         ]
       }
     ]
   },
   'Salvador – Barra': {
     promo: 'Acarajé + Bebida por R$ 22,00!',
     categorias: [
       {
         nome: 'Lanches & Pratos',
         icone: '',
         produtos: [
           { nome: 'Acarajé da Barra',   preco: 16.90, svg: 'acaraje'   },
           { nome: 'Moqueca Baiana',      preco: 34.90, svg: 'moqueca'   },
           { nome: 'Vatapá no Pão',       preco: 14.90, svg: 'wrap'      },
           { nome: 'Sarapatel Soterop.',  preco: 26.90, svg: 'sarapatel' },
         ]
       },
       {
         nome: 'Bebidas',
         icone: '',
         produtos: [
           { nome: 'Suco de Acerola', preco: 8.90, svg: 'suco'      },
           { nome: 'Água de Coco',    preco: 7.90, svg: 'coco'      },
           { nome: 'Tamarindo Gelado',preco: 7.50, svg: 'tamarindo' },
         ]
       }
     ]
   },
   'João Pessoa': {
     promo: 'Tapioca recheada com 10% OFF hoje!',
     categorias: [
       {
         nome: 'Lanches',
         icone: '',
         produtos: [
           { nome: 'Tapioca Recheada',    preco: 15.90, svg: 'tapioca'   },
           { nome: 'Carne de Sol Wrap',   preco: 18.90, svg: 'wrap'      },
           { nome: 'Macaxeira Assada',    preco: 12.90, svg: 'macaxeira' },
           { nome: 'Baião Burger Paraíba',preco: 21.90, svg: 'burger'    },
         ]
       },
       {
         nome: 'Bebidas',
         icone: '',
         produtos: [
           { nome: 'Suco de Umbú',    preco: 8.90, svg: 'umbu'    },
           { nome: 'Cajuína Gelada',  preco: 7.50, svg: 'cajuina' },
           { nome: 'Água de Coco',    preco: 7.90, svg: 'coco'    },
         ]
       }
     ]
   }
 };

 const svgMap = {
   'tapioca': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="13" rx="9" ry="5"/><path d="M3 13c0-3 4-7 9-7s9 4 9 7"/><line x1="8" y1="9" x2="8" y2="17"/><line x1="12" y1="7" x2="12" y2="18"/><line x1="16" y1="9" x2="16" y2="17"/></svg>`,
   'burger': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13h16"/><path d="M4 17h16"/><path d="M6 9c0-2.2 2.7-4 6-4s6 1.8 6 4H6z"/><rect x="3" y="17" width="18" height="3" rx="1.5"/></svg>`,
   'wrap': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3C7 3 4 7 4 12l4 9h8l4-9c0-5-3-9-8-9z"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="9" y1="9" x2="15" y2="9"/></svg>`,
   'macaxeira': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="8" rx="2"/><path d="M7 11V8a2 2 0 114 0v3"/><path d="M13 11V7a2 2 0 114 0v4"/><line x1="9" y1="15" x2="9" y2="17"/><line x1="12" y1="15" x2="12" y2="17"/><line x1="15" y1="15" x2="15" y2="17"/></svg>`,
   'suco': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l1 6H7L8 2z"/><path d="M7 8l1 13h8l1-13"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
   'coco': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-1 3-4 4-4 8a4 4 0 008 0c0-4-3-5-4-8z"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>`,
   'acaraje': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="15" rx="8" ry="4"/><path d="M4 15c0-4 3.6-7 8-7s8 3 8 7"/><path d="M9 11c1-2 3-2 4 0"/></svg>`,
   'moqueca': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16v2a8 8 0 01-16 0V9z"/><path d="M8 9V7a4 4 0 018 0v2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>`,
   'baiao': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="10" rx="2"/><path d="M3 14h18"/><path d="M7 10V7a5 5 0 0110 0v3"/></svg>`,
   'xinxim': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4"/><line x1="12" y1="16" x2="12" y2="20"/></svg>`,
   'sarapatel': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M6 12V6a6 6 0 0112 0v6"/><path d="M4 12v2a8 8 0 0016 0v-2"/></svg>`,
   'caldo': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11h14v3a7 7 0 01-14 0v-3z"/><path d="M8 11V8a4 4 0 018 0v3"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
   'cajuina': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l1 5H6L7 3z"/><path d="M6 8l1.5 13h9L18 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>`,
   'umbu': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l1 6H7L8 2z"/><path d="M7 8l1 13h8l1-13"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
   'tamarindo': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14l2 6H3L5 3z"/><path d="M3 9l2 12h14l2-12"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`,
 };

 // ===== UNIDADE =====
 let unidadeAtual = 'Fortaleza – Centro';

 function selUnidade(btn) {
     document.querySelectorAll('.unidade-btn').forEach(b => b.classList.remove('sel'));
     btn.classList.add('sel');
     unidadeAtual = btn.textContent.trim();
     renderCardapio(unidadeAtual);
     toastMsg('Cardápio carregado: ' + unidadeAtual);
 }

 function renderCardapio(unidade) {
     const dados = cardapios[unidade];
     if (!dados) return;
     const container = document.getElementById('cardapio-dinamico');
     if (!container) return;

     document.getElementById('promo-banner-texto').textContent = dados.promo;

     let html = '';
     dados.categorias.forEach(function(cat) {
         html += '<div class="categoria-label">' + cat.icone + ' ' + cat.nome + '</div><div class="cardapio-grid">';
         cat.produtos.forEach(function(p) {
             const precoFmt = 'R$ ' + p.preco.toFixed(2).replace('.', ',');
             html += '<div class="produto-card">' +
               '<div class="produto-img">' + (svgMap[p.svg] || '') + '</div>' +
               '<div class="produto-info">' +
                 '<div class="produto-nome">' + p.nome + '</div>' +
                 '<div class="produto-preco">' + precoFmt + '</div>' +
                 '<button class="produto-add" onclick="addCarrinho(\'' + p.nome + '\', ' + p.preco + ')">+ Adicionar</button>' +
               '</div>' +
             '</div>';
         });
         html += '</div>';
     });
     container.innerHTML = html;
 }

 // ===== CARRINHO =====
 function addCarrinho(nome, preco) {
     const ex = carrinho.find(i => i.nome === nome);
     if (ex) ex.qtd++;
     else carrinho.push({
         nome,
         preco,
         qtd: 1
     });
     atualizarBadge();
     toastMsg(' ' + nome + ' adicionado!');
 }

 function atualizarBadge() {
     const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     const qtd = carrinho.reduce((s, i) => s + i.qtd, 0);
     document.getElementById('badge-qtd').textContent = qtd + ' ' + (qtd === 1 ? 'item' : 'itens') + ' · R$ ' + total.toFixed(2).replace('.', ',');
 }

 function renderPedido() {
     const lista = document.getElementById('pedido-lista');
     const resumo = document.getElementById('pedido-resumo');
     const pagWrap = document.getElementById('forma-pag-wrap');

     if (carrinho.length === 0) {
         lista.innerHTML = '<p style="color:var(--cinza);text-align:center;padding:20px;">Nenhum item. <a href="#" onclick="irPara(\'cardapio\')" style="color:var(--verde);">Ver cardápio</a></p>';
         resumo.style.display = 'none';
         pagWrap.style.display = 'none';
         return;
     }

     lista.innerHTML = carrinho.map((item, idx) => `
 <div class="pedido-item">
 <div>
 <div class="nome">${item.nome}</div>
 <div style="font-size:.82rem;color:var(--cinza);">R$ ${item.preco.toFixed(2).replace('.',',')} cada</div>
 </div>
 <div class="qtd-ctrl">
 <button class="qtd-btn" onclick="mudarQtd(${idx}, -1)">−</button>
 <span style="font-weight:700;">${item.qtd}</span>
 <button class="qtd-btn" onclick="mudarQtd(${idx}, 1)">+</button>
 </div>
 <div class="preco">R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</div>
 </div>
 `).join('');

     const sub = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     document.getElementById('sub-total').textContent = 'R$ ' + sub.toFixed(2).replace('.', ',');
     // Reset desconto Pix ao re-renderizar
     pixAtivo = false;
     document.querySelectorAll('.pag-btn').forEach(b => b.classList.remove('sel'));
     const primeiroBtn = document.querySelector('.pag-btn');
     if (primeiroBtn) primeiroBtn.classList.add('sel');
     const aviso = document.getElementById('pix-desconto-aviso');
     const linhaDesconto = document.getElementById('linha-desconto-pix');
     if (aviso) aviso.style.display = 'none';
     if (linhaDesconto) linhaDesconto.style.display = 'none';
     atualizarTotais();
     resumo.style.display = 'block';
     pagWrap.style.display = 'block';
 }

 function mudarQtd(idx, delta) {
     carrinho[idx].qtd += delta;
     if (carrinho[idx].qtd <= 0) carrinho.splice(idx, 1);
     atualizarBadge();
     renderPedido();
 }

 // ===== PAGAMENTO =====
 let pixAtivo = false;

 function selPag(btn, metodo) {
     document.querySelectorAll('.pag-btn').forEach(b => b.classList.remove('sel'));
     btn.classList.add('sel');

     const aviso = document.getElementById('pix-desconto-aviso');
     const linhaDesconto = document.getElementById('linha-desconto-pix');
     pixAtivo = metodo === 'pix';

     if (pixAtivo) {
         aviso.style.display = 'flex';
         linhaDesconto.style.display = 'flex';
     } else {
         aviso.style.display = 'none';
         linhaDesconto.style.display = 'none';
     }
     atualizarTotais();
 }

 function atualizarTotais() {
     const sub = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     const descPix = pixAtivo ? sub * 0.10 : 0;
     const total = sub + 4.99 - 5.00 - descPix;

     document.getElementById('sub-total').textContent = 'R$ ' + sub.toFixed(2).replace('.', ',');
     const pixValorEl = document.getElementById('pix-desconto-valor');
     if (pixValorEl) pixValorEl.textContent = '- R$ ' + descPix.toFixed(2).replace('.', ',');
     document.getElementById('total-final').textContent = 'R$ ' + Math.max(total, 0).toFixed(2).replace('.', ',');
 }

 function calcularPontosGanhos(totalPago) {
     return Math.floor(totalPago / 10);
 }

 function atualizarExibicaoPontos() {
     // Atualiza contadores nas telas de fidelidade (web e totem)
     document.querySelectorAll('.pontos-big, .t-pontos-big').forEach(el => {
         el.textContent = pontosAcumulados;
     });
 }

 function processarPagamento() {
     const sub = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     const descPix = pixAtivo ? sub * 0.10 : 0;
     const totalPago = Math.max(sub + 4.99 - 5.00 - descPix, 0);
     const pontosGanhos = calcularPontosGanhos(totalPago);

     document.getElementById('modal-pag').classList.add('aberto');
     document.getElementById('pag-processando').style.display = 'block';
     document.getElementById('pag-sucesso').style.display = 'none';
     setTimeout(() => {
         pontosAcumulados += pontosGanhos;
         atualizarExibicaoPontos();
         // Atualiza texto do modal com os pontos ganhos neste pedido
         const msgPontos = document.getElementById('msg-pontos-ganhos');
         if (msgPontos) {
             msgPontos.innerHTML = 'Você ganhou <strong>' + pontosGanhos + ' ponto' + (pontosGanhos !== 1 ? 's' : '') + '</strong> de fidelidade! Total acumulado: <strong>' + pontosAcumulados + ' pts</strong>';
         }
         document.getElementById('pag-processando').style.display = 'none';
         document.getElementById('pag-sucesso').style.display = 'block';
         carrinho.length = 0;
         atualizarBadge();
     }, 2800);
 }

 // ===== STATUS =====
 const stepsData = [{
         icon: '',
         titulo: 'Pedido Recebido',
         sub: '14:32 – Confirmado'
     },
     {
         icon: '',
         titulo: 'Pagamento Aprovado',
         sub: '14:33 – Aprovado'
     },
     {
         icon: '‍',
         titulo: 'Em Preparo',
         sub: 'Cozinha trabalhando...'
     },
     {
         icon: '',
         titulo: 'Pronto para Retirada',
         sub: 'Vá ao balcão!'
     },
     {
         icon: '',
         titulo: 'Pedido Retirado',
         sub: 'Bom apetite!'
     },
 ];

 function simularAvanco() {
     if (statusAtual >= 4) {
         toastMsg('Pedido já finalizado! ');
         return;
     }
     statusAtual++;
     const steps = document.querySelectorAll('.step');
     steps.forEach((s, i) => {
         s.classList.remove('done', 'atual');
         if (i < statusAtual) s.classList.add('done');
         else if (i === statusAtual) s.classList.add('atual');
     });
     const pcts = ['0%', '33%', '50%', '66%', '100%'];
     document.getElementById('prog-fill').style.height = pcts[statusAtual] || '100%';
     if (statusAtual === 4) toastMsg(' Pedido retirado! Bom apetite!');
 }

 // ===== FIDELIDADE =====
 function resgatar(card, nome) {
     if (card.classList.contains('bloqueado')) {
         toastMsg(' Pontos insuficientes!');
         return;
     }
     toastMsg(' Resgatando: ' + nome + '...');
 }

 // ===== LGPD MODAL =====
 function abrirModalLGPD() {
     document.getElementById('modal-lgpd').classList.add('aberto');
 }

 function abrirModalPrivacidade() {
     document.getElementById('modal-privacidade').classList.add('aberto');
 }

 // ===== VALIDAÇÃO LOGIN =====
 function tentarLogin() {
     let valido = true;

     const emailVal = document.getElementById('login-email').value.trim();
     if (!emailVal) {
         mostrarErroLogin('login-email', 'E-mail é obrigatório.');
         valido = false;
     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
         mostrarErroLogin('login-email', 'Informe um e-mail válido. Ex: nome@dominio.com');
         valido = false;
     }

     const senhaVal = document.getElementById('login-senha').value;
     if (!senhaVal) {
         mostrarErroLogin('login-senha', 'Senha é obrigatória.');
         valido = false;
     }

     if (!valido) return;
     irPara('cardapio');
 }

 function mostrarErroLogin(id, msg) {
     const el = document.getElementById(id);
     el.style.borderColor = 'var(--vermelho)';
     let erro = el.parentElement.querySelector('.campo-erro');
     if (!erro) {
         erro = document.createElement('span');
         erro.className = 'campo-erro';
         erro.style.cssText = 'color:var(--vermelho);font-size:0.78rem;margin-top:3px;display:block;';
         el.parentElement.appendChild(erro);
     }
     erro.textContent = msg;
     el.addEventListener('input', () => {
         el.style.borderColor = '';
         if (erro) erro.textContent = '';
     }, {
         once: true
     });
 }

 // ===== VALIDAÇÃO CADASTRO =====
 const camposCadastro = ['cad-nome', 'cad-email', 'cad-cpf', 'cad-tel', 'cad-senha'];

 function mostrarErro(id, msg) {
     const el = document.getElementById(id);
     el.style.borderColor = 'var(--vermelho)';
     let erro = el.parentElement.querySelector('.campo-erro');
     if (!erro) {
         erro = document.createElement('span');
         erro.className = 'campo-erro';
         erro.style.cssText = 'color:var(--vermelho);font-size:0.78rem;margin-top:3px;display:block;';
         el.parentElement.appendChild(erro);
     }
     erro.textContent = msg;
     el.addEventListener('input', () => {
         el.style.borderColor = '';
         if (erro) erro.textContent = '';
     }, {
         once: true
     });
 }

 function limparCPF(v) {
     return v.replace(/\D/g, '');
 }

 function validarCPF(cpf) {
     cpf = limparCPF(cpf);
     if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
     let soma = 0;
     for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
     let r = (soma * 10) % 11;
     if (r === 10 || r === 11) r = 0;
     if (r !== parseInt(cpf[9])) return false;
     soma = 0;
     for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
     r = (soma * 10) % 11;
     if (r === 10 || r === 11) r = 0;
     return r === parseInt(cpf[10]);
 }

 function validarEmail(v) {
     return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
 }

 function validarTelefone(v) {
     const n = v.replace(/\D/g, '');
     return n.length === 10 || n.length === 11;
 }

 // Máscaras automáticas
 document.getElementById('cad-cpf').addEventListener('input', function() {
     let v = this.value.replace(/\D/g, '').slice(0, 11);
     v = v.replace(/(\d{3})(\d)/, '$1.$2');
     v = v.replace(/(\d{3})(\d)/, '$1.$2');
     v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
     this.value = v;
 });

 document.getElementById('cad-tel').addEventListener('input', function() {
     let v = this.value.replace(/\D/g, '').slice(0, 11);
     if (v.length <= 10) {
         v = v.replace(/(\d{2})(\d)/, '($1) $2');
         v = v.replace(/(\d{4})(\d)/, '$1-$2');
     } else {
         v = v.replace(/(\d{2})(\d)/, '($1) $2');
         v = v.replace(/(\d{5})(\d)/, '$1-$2');
     }
     this.value = v;
 });

 function tentarCadastrar() {
     let valido = true;

     if (!document.getElementById('cad-nome').value.trim()) {
         mostrarErro('cad-nome', 'Nome completo é obrigatório.');
         valido = false;
     }

     const emailVal = document.getElementById('cad-email').value.trim();
     if (!emailVal) {
         mostrarErro('cad-email', 'E-mail é obrigatório.');
         valido = false;
     } else if (!validarEmail(emailVal)) {
         mostrarErro('cad-email', 'Informe um e-mail válido. Ex: nome@dominio.com');
         valido = false;
     }

     const cpfVal = document.getElementById('cad-cpf').value;
     if (!cpfVal.trim()) {
         mostrarErro('cad-cpf', 'CPF é obrigatório.');
         valido = false;
     } else if (!validarCPF(cpfVal)) {
         mostrarErro('cad-cpf', 'CPF inválido. Informe os 11 dígitos corretamente.');
         valido = false;
     }

     const telVal = document.getElementById('cad-tel').value;
     if (!telVal.trim()) {
         mostrarErro('cad-tel', 'Telefone é obrigatório.');
         valido = false;
     } else if (!validarTelefone(telVal)) {
         mostrarErro('cad-tel', 'Telefone inválido. Informe DDD + número. Ex: (85) 99999-9999');
         valido = false;
     }

     const senhaVal = document.getElementById('cad-senha').value;
     if (!senhaVal) {
         mostrarErro('cad-senha', 'Senha é obrigatória.');
         valido = false;
     } else if (senhaVal.length < 8) {
         mostrarErro('cad-senha', 'A senha deve ter no mínimo 8 caracteres.');
         valido = false;
     }

     const lgpd = document.getElementById('lgpd1');
     let erroLgpd = lgpd.closest('.lgpd-check').querySelector('.lgpd-erro');
     if (!lgpd.checked) {
         if (!erroLgpd) {
             erroLgpd = document.createElement('span');
             erroLgpd.className = 'lgpd-erro';
             erroLgpd.style.cssText = 'color:var(--vermelho);font-size:0.78rem;margin-top:4px;display:block;';
             lgpd.closest('.lgpd-check').appendChild(erroLgpd);
         }
         erroLgpd.textContent = 'Você precisa aceitar a Política de Privacidade.';
         lgpd.addEventListener('change', () => {
             if (erroLgpd) erroLgpd.textContent = '';
         }, {
             once: true
         });
         valido = false;
     } else if (erroLgpd) {
         erroLgpd.textContent = '';
     }

     if (!valido) return;
     abrirModalLGPD();
 }

 function fecharModal(id) {
     document.getElementById(id).classList.remove('aberto');
 }

 function aceitarLGPD() {
     fecharModal('modal-lgpd');
     toastMsg(' Cadastro realizado com sucesso!');
     setTimeout(() => irPara('cardapio'), 1200);
 }

 // ===== TOAST =====
 function toastMsg(msg) {
     const t = document.getElementById('toast');
     t.textContent = msg;
     t.classList.add('visivel');
     setTimeout(() => t.classList.remove('visivel'), 2800);
 }

 function sairDoTotem() {
     irPara('cardapio');
     irTotem('home'); // reseta sub-navegação do totem para home
 }

 // ===== CARDÁPIO TOTEM (fixo em Fortaleza – Centro) =====
 function renderCardapioTotem() {
     const dados = cardapios['Fortaleza – Centro'];
     if (!dados) return;
     const container = document.getElementById('t-cardapio-dinamico');
     if (!container) return;

     document.getElementById('t-promo-banner-texto').textContent = dados.promo;

     let html = '';
     dados.categorias.forEach(function(cat) {
         html += '<div class="t-categoria">' + cat.icone + ' ' + cat.nome + '</div><div class="t-cardapio-grid">';
         cat.produtos.forEach(function(p) {
             const precoFmt = 'R$ ' + p.preco.toFixed(2).replace('.', ',');
             html += '<div class="t-produto">' +
               '<div class="t-prod-img">' + (svgMap[p.svg] || '') + '</div>' +
               '<div class="t-prod-info">' +
                 '<div class="t-prod-nome">' + p.nome + '</div>' +
                 '<div class="t-prod-preco">' + precoFmt + '</div>' +
                 '<button class="t-prod-add" onclick="tAddCarrinho(\'' + p.nome + '\', ' + p.preco + ')">+ Adicionar</button>' +
               '</div>' +
             '</div>';
         });
         html += '</div>';
     });
     container.innerHTML = html;
 }

 // ===== TOTEM – sub-navegação =====
 const tCarrinho = [];
 let tStatusAtual = 2;

 function irTotem(sub) {
     document.querySelectorAll('.totem-subtela').forEach(s => s.classList.remove('t-visivel'));
     document.getElementById('t-' + sub).classList.add('t-visivel');
     document.querySelectorAll('.t-pill').forEach(p => p.classList.remove('t-ativa'));
     const map = {
         home: 0,
         cardapio: 1,
         pedido: 2,
         status: 3,
         fidelidade: 4
     };
     document.querySelectorAll('.t-pill')[map[sub]]?.classList.add('t-ativa');
     if (sub === 'pedido') tRenderPedido();
     document.getElementById('tela-totem').scrollTop = 0;
 }

 function tAddCarrinho(nome, preco) {
     const ex = tCarrinho.find(i => i.nome === nome);
     if (ex) ex.qtd++;
     else tCarrinho.push({
         nome,
         preco,
         qtd: 1
     });
     tAtualizarBadge();
     toastMsg(' ' + nome + ' adicionado!');
 }

 function tAtualizarBadge() {
     const total = tCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     const qtd = tCarrinho.reduce((s, i) => s + i.qtd, 0);
     const b = document.getElementById('t-badge');
     if (b) b.textContent = qtd + ' ' + (qtd === 1 ? 'item' : 'itens') + ' · R$ ' + total.toFixed(2).replace('.', ',');
 }

 function tRenderPedido() {
     const lista = document.getElementById('t-pedido-lista');
     const resumoWrap = document.getElementById('t-resumo-wrap');
     if (!lista) return;
     if (tCarrinho.length === 0) {
         lista.innerHTML = '<p style="color:rgba(255,255,255,.45);text-align:center;padding:20px;">Nenhum item. <span style="color:var(--amarelo);cursor:pointer;" onclick="irTotem(\'cardapio\')">Ver cardápio →</span></p>';
         resumoWrap.style.display = 'none';
         return;
     }
     lista.innerHTML = tCarrinho.map((item, idx) => `
 <div class="t-pedido-item">
 <div>
 <div class="nome">${item.nome}</div>
 <div class="unitario">R$ ${item.preco.toFixed(2).replace('.',',')} cada</div>
 </div>
 <div class="qtd-ctrl" style="display:flex;gap:8px;align-items:center;">
 <button class="qtd-btn" style="background:rgba(255,255,255,.12);color:#fff;" onclick="tMudarQtd(${idx},-1)">−</button>
 <span style="font-weight:700;color:#fff;">${item.qtd}</span>
 <button class="qtd-btn" style="background:rgba(255,255,255,.12);color:#fff;" onclick="tMudarQtd(${idx},1)">+</button>
 </div>
 <div style="color:var(--amarelo);font-weight:700;min-width:60px;text-align:right;">R$ ${(item.preco*item.qtd).toFixed(2).replace('.',',')}</div>
 </div>
 `).join('');
     // Reset desconto Pix ao re-renderizar
     tPixAtivo = false;
     document.querySelectorAll('.t-pag-btn').forEach(b => b.classList.remove('sel'));
     const primeiroTBtn = document.querySelector('.t-pag-btn');
     if (primeiroTBtn) primeiroTBtn.classList.add('sel');
     const tAviso = document.getElementById('t-pix-desconto-aviso');
     const tLinhaDesc = document.getElementById('t-linha-desconto-pix');
     if (tAviso) tAviso.style.display = 'none';
     if (tLinhaDesc) tLinhaDesc.style.display = 'none';
     tAtualizarTotais();
     resumoWrap.style.display = 'block';
 }

 function tMudarQtd(idx, delta) {
     tCarrinho[idx].qtd += delta;
     if (tCarrinho[idx].qtd <= 0) tCarrinho.splice(idx, 1);
     tAtualizarBadge();
     tRenderPedido();
 }

 let tPixAtivo = false;

 function tSelPag(btn, metodo) {
     document.querySelectorAll('.t-pag-btn').forEach(b => b.classList.remove('sel'));
     btn.classList.add('sel');

     const aviso = document.getElementById('t-pix-desconto-aviso');
     const linhaDesconto = document.getElementById('t-linha-desconto-pix');
     tPixAtivo = metodo === 'pix';

     if (tPixAtivo) {
         aviso.style.display = 'flex';
         linhaDesconto.style.display = 'flex';
     } else {
         aviso.style.display = 'none';
         linhaDesconto.style.display = 'none';
     }
     tAtualizarTotais();
 }

 function tAtualizarTotais() {
     const sub = tCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     const descPix = tPixAtivo ? sub * 0.10 : 0;
     const total = Math.max(sub - 5.00 - descPix, 0);
     document.getElementById('t-sub').textContent = 'R$ ' + sub.toFixed(2).replace('.', ',');
     const pixValorEl = document.getElementById('t-pix-desconto-valor');
     if (pixValorEl) pixValorEl.textContent = '- R$ ' + descPix.toFixed(2).replace('.', ',');
     document.getElementById('t-total').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
 }

 function tProcessarPag() {
     const tSub = tCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     const tDescPix = tPixAtivo ? tSub * 0.10 : 0;
     const tTotalPago = Math.max(tSub - 5.00 - tDescPix, 0);
     const tPontosGanhos = calcularPontosGanhos(tTotalPago);

     document.getElementById('modal-pag').classList.add('aberto');
     document.getElementById('pag-processando').style.display = 'block';
     document.getElementById('pag-sucesso').style.display = 'none';
     setTimeout(() => {
         pontosAcumulados += tPontosGanhos;
         atualizarExibicaoPontos();
         const msgPontos = document.getElementById('msg-pontos-ganhos');
         if (msgPontos) {
             msgPontos.innerHTML = 'Você ganhou <strong>' + tPontosGanhos + ' ponto' + (tPontosGanhos !== 1 ? 's' : '') + '</strong> de fidelidade! Total acumulado: <strong>' + pontosAcumulados + ' pts</strong>';
         }
         document.getElementById('pag-processando').style.display = 'none';
         document.getElementById('pag-sucesso').style.display = 'block';
         tCarrinho.length = 0;
         tAtualizarBadge();
     }, 2800);
 }

 // override o botão do modal pra redirecionar ao status do totem
 document.addEventListener('DOMContentLoaded', () => {
     // Renderiza cardápios iniciais
     renderCardapio('Fortaleza – Centro');
     renderCardapioTotem();

     const btnSucesso = document.getElementById('btn-acompanhar');
     if (btnSucesso) {
         btnSucesso.addEventListener('click', () => {
             fecharModal('modal-pag');
             if (document.getElementById('tela-totem').classList.contains('ativa')) {
                 irTotem('status');
             } else {
                 irPara('status');
             }
         });
     }
 });

 function tSimularAvanco() {
     if (tStatusAtual >= 4) {
         toastMsg(' Pedido já finalizado!');
         return;
     }
     tStatusAtual++;
     const steps = document.querySelectorAll('#t-status .t-step');
     steps.forEach((s, i) => {
         s.classList.remove('done', 'atual');
         if (i < tStatusAtual) s.classList.add('done');
         else if (i === tStatusAtual) s.classList.add('atual');
     });
     const pcts = ['0%', '33%', '55%', '75%', '100%'];
     const fill = document.getElementById('t-prog-fill');
     if (fill) fill.style.height = pcts[tStatusAtual] || '100%';
     if (tStatusAtual === 4) toastMsg(' Pedido retirado! Bom apetite!');
 }

 function tResgatar(card, nome) {
     if (card.classList.contains('bloqueado')) {
         toastMsg(' Pontos insuficientes!');
         return;
     }
     toastMsg(' Resgatando: ' + nome + '...');
 }
