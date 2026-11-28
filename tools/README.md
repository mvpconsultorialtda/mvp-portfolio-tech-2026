# Gerar o PDF do portfólio

1. Na raiz do repositório: `python3 -m http.server 8765`
2. Em outro terminal: `node tools/gerar-pdf.js` (precisa do Playwright com Chromium). Gera um PDF por página em `/tmp/claude-0/s/pdf-NN.pdf`.
3. Juntar na ordem (ex.: `pypdf`) e salvar como `mvp-portfolio-2026.pdf`.

O script força os elementos animados a aparecerem, troca o fundo com blur por gradiente fixo e reduz as imagens ao tamanho em que aparecem, para o PDF ficar em ~12 MB.
