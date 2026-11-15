# Copiloto de Triagem N1 — Câmera IP sem gravação

Protótipo de uma ferramenta que ajuda o analista de suporte N1 a conferir, durante o atendimento,
quais testes de um playbook técnico já têm evidência no relato e o que ainda falta, antes de escalar para o N2.

> **Aviso:** Usa apenas dados sintéticos. **Não cole dados reais** (senhas, IPs de
> clientes, dados pessoais): no plano gratuito da API do Gemini, o conteúdo enviado pode ser usado pelo
> provedor para melhorar seus produtos.

## O problema

Na rotina de suporte técnico, chamados escalam do N1 para o N2 com relatos vagos ("reiniciei o gravador
e não voltou"). O N2 então devolve o chamado para cobrar o básico (ping, portas, estado do disco,
versão de firmware), o que consome tempo especializado e atrasa a solução.

Essa percepção vem da minha experiência com operações e suporte.

## O que a ferramenta faz (e o que não faz)

**Faz:**
- Recebe o relato do N1 e o local de gravação (câmera com cartão SD, NVR/DVR ou VMS).
- Mascara dados sensíveis no servidor, antes de qualquer chamada ao modelo.
- Classifica cada passo do playbook como **executado** (com citação do trecho do relato),
  **vago** ou **ausente**.
- Para cada passo pendente, mostra o próximo passo escrito no playbook.

**Não faz:**
- Não executa comandos, não acessa equipamentos e não resolve o chamado.
- Não bloqueia escalonamento: é uma sugestão, a decisão é sempre do analista.
- Não gera instruções técnicas: o texto de cada ação vem do playbook, escrito por humano.
- Não verifica se o relato é verdadeiro, só se ele contém evidência técnica compatível.

## Por que IA

O relato é texto livre e o mesmo teste é descrito de muitas formas ("não pinga o gateway",
"100% de perda", saída colada do terminal). Regras fixas e campos obrigatórios validam que há texto,
não que o texto tem sentido técnico.

### Por que não um assistente de chat?

Um assistente com os playbooks colados já entrega boa parte da ideia. O que o app acrescenta são
garantias que um chat não oferece: sanitização em código, validação de IDs e citações, saída estruturada
estável, limites de uso, e medição reproduzível.

## Como funciona

```
Relato do N1
        │
        ▼
  Sanitizador (código, sem IA)  ── mascara CPF, e-mail, senha, token, IP público
        │
        ▼
  Filtro de passos (código)     ── só passos do playbook que valem para aquele local
        │
        ▼
  Modelo (Gemini)               ── classifica cada passo; saída em JSON com schema restrito
        │
        ▼
  Validação (código)            ── IDs existem? a citação aparece no relato?
        │
        ▼
  Checklist para o N1           ── executado / vago / ausente + próximo passo do playbook
```

O modelo faz **uma única tarefa**, classificar. Não é um agente: não decide o fluxo nem usa ferramentas.

## Playbook

`playbooks/camera-ip-sem-gravacao.ts` define 10 passos tipados. Cada um tem: ID estável, o que o N2
conclui com o resultado, **o que conta como evidência**, exemplos de relato vago e a ação sugerida.

Hoje os playbooks ficam no código (versionados no Git, checados pelo TypeScript, avaliação
reproduzível).

## IA com responsabilidade

| Risco | Tratamento |
|---|---|
| Alucinação (inventar teste ou passo) | Schema restrito aos IDs do playbook + validação em código; citação do relato exigida e conferida |
| Instrução técnica insegura | O modelo não escreve instruções; elas vêm do playbook, com avisos (ex.: não formatar disco) |
| Dados sensíveis | Sanitizador em código antes do envio (melhor esforço, ver limitações); aviso de dados sintéticos |
| Privacidade no provedor | Plano gratuito pode usar o conteúdo para melhorar produtos; uso real exigiria plano pago e aprovação |
| Custo e abuso | Chave só no servidor; limite de requisições (planejado) |
| Excesso de confiança | Saída é sugestão com justificativa; o analista decide |

## Limitações

- Avalia o texto do relato, não a realidade: um relato falso com boa descrição passa.
- Cenários sintéticos escritos por uma pessoa só; não representam a variedade de chamados reais.
- O sanitizador por regex é de melhor esforço e não pega todo segredo.
- Playbooks no código, não editáveis por quem não programa.
- Sem integração com sistema de chamados; o uso hoje é copiar e colar.

## Próximos passos

- Mais playbooks (rede lenta, queda entre filiais).
- Integração com o sistema de chamados, com plano pago e base legal para dados reais.
- Banco relacional para versionar playbooks.
- Piloto para medir devoluções do N2 e tempo até escalonar.

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha GEMINI_API_KEY e GEMINI_MODEL
npm run dev
```

Nunca versione `.env.local`.

## Estrutura

```
app/        interface e rota da API
lib/        tipos, sanitizador, classificador, validação, baseline
playbooks/  playbook(s)
eval/       cenários rotulados e script de avaliação
```