# Calculadora do Zicão → App Store

O app já está preparado (Capacitor + vibração nativa + ícone + tela de abertura).
Quando for publicar, é só seguir no **Mac**:

## 1. Uma vez só
1. Conta **Apple Developer** (US$ 99/ano): developer.apple.com → Enroll (dá pra usar o CNPJ da loja).
2. Instalar **Xcode** (App Store do Mac) e abrir uma vez pra aceitar os termos.
3. Instalar **Node.js** (nodejs.org, versão LTS).

## 2. Gerar o projeto iOS
No Terminal, dentro da pasta do repositório:
```
npm install
npx cap add ios
npm run icones
npm run ios
```
O último comando abre o Xcode.

## 3. No Xcode
1. Clicar em **App** (lateral esquerda) → aba **Signing & Capabilities** → **Team**: escolher sua conta.
2. Plugar o iPhone e dar ▶️ pra testar no aparelho.
3. Menu **Product → Archive** → **Distribute App** → **App Store Connect**.

## 4. No App Store Connect (appstoreconnect.apple.com)
- Criar o app com o Bundle ID `br.com.zicaostore.calculadora`.
- **Política de privacidade**: `https://thiagogaldinozicao-source.github.io/Calculadora-do-zicao/privacidade.html`
- **Privacidade do app**: "Não coletamos dados".
- Prints: tirar do iPhone (calculadora, ferramentas da loja, temas).
- Destacar na descrição as **ferramentas de loja** (parcelamento com taxa da maquininha, lucro/markup, câmbio). Calculadora "comum" costuma ser recusada pela Apple (diretriz 4.3); o diferencial é isso.

## Atualizar depois
Mexeu no `index.html` → `npm run ios` → Archive de novo (subir o número da versão no Xcode).
