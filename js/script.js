 // ===== ESTADO =====
 const carrinho = [];
 let pagSel = 0;
 let statusAtual = 2; // 0-based index

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

 // ===== UNIDADE =====
 function selUnidade(btn) {
     document.querySelectorAll('.unidade-btn').forEach(b => b.classList.remove('sel'));
     btn.classList.add('sel');
     toastMsg('Cardápio carregado: ' + btn.textContent);
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
     const total = sub + 4.99 - 5.00;
     document.getElementById('sub-total').textContent = 'R$ ' + sub.toFixed(2).replace('.', ',');
     document.getElementById('total-final').textContent = 'R$ ' + Math.max(total, 0).toFixed(2).replace('.', ',');
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
 function selPag(btn) {
     document.querySelectorAll('.pag-btn').forEach(b => b.classList.remove('sel'));
     btn.classList.add('sel');
 }

 function processarPagamento() {
     document.getElementById('modal-pag').classList.add('aberto');
     document.getElementById('pag-processando').style.display = 'block';
     document.getElementById('pag-sucesso').style.display = 'none';
     setTimeout(() => {
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
     const sub = tCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
     const total = Math.max(sub - 5, 0);
     document.getElementById('t-sub').textContent = 'R$ ' + sub.toFixed(2).replace('.', ',');
     document.getElementById('t-total').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
     resumoWrap.style.display = 'block';
 }

 function tMudarQtd(idx, delta) {
     tCarrinho[idx].qtd += delta;
     if (tCarrinho[idx].qtd <= 0) tCarrinho.splice(idx, 1);
     tAtualizarBadge();
     tRenderPedido();
 }

 function tSelPag(btn) {
     document.querySelectorAll('.t-pag-btn').forEach(b => b.classList.remove('sel'));
     btn.classList.add('sel');
 }

 function tProcessarPag() {
     document.getElementById('modal-pag').classList.add('aberto');
     document.getElementById('pag-processando').style.display = 'block';
     document.getElementById('pag-sucesso').style.display = 'none';
     setTimeout(() => {
         document.getElementById('pag-processando').style.display = 'none';
         document.getElementById('pag-sucesso').style.display = 'block';
         tCarrinho.length = 0;
         tAtualizarBadge();
     }, 2800);
 }

 // override o botão do modal pra redirecionar ao status do totem
 document.addEventListener('DOMContentLoaded', () => {
     const btnSucesso = document.querySelector('#pag-sucesso .btn-primario');
     if (btnSucesso) {
         btnSucesso.addEventListener('click', () => {
             fecharModal('modal-pag');
             // detecta se totem está ativo
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
