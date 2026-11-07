# IA PhD — Landing

Página estática da IA PhD. Não tem build, banco nem dependências.

## Arquivos

- `index.html` — página
- `styles.css` — visual
- `main.js` — perfil e conversa no WhatsApp
- `favicon.svg` — marca

## Endereços de campanha

- `/?perfil=profissional`
- `/?perfil=empresario`

Sem o parâmetro, a página abre no manifesto e a pessoa escolhe o perfil.

## Antes de publicar

O número do WhatsApp está em `main.js`, na constante `WHATSAPP`. Troque esse valor se o canal da campanha for outro.

## GitHub

Na pasta do projeto:

```bash
git add .
git commit -m "Publica a landing da IA PhD."
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ia-phd-landing.git
git push -u origin main
```

## Vercel

1. Importe o repositório do GitHub.
2. Framework Preset: **Other**.
3. Build Command fica vazio. O `vercel.json` já define isso.
4. Output Directory: `.`
5. Faça o deploy.

A raiz do repositório é o site. A Vercel publica `index.html` direto.
