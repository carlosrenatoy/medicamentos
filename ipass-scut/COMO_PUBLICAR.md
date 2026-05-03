# Como Publicar seu App na Internet 🚀

Seu aplicativo é **estático** (funciona apenas com HTML, CSS e Javascript no navegador), o que torna a publicação muito fácil e gratuita.

## Método Mais Fácil: Netlify Drop

Este método não requer conhecimentos de programação ou servidores.

### Passo 1: Preparar os arquivos

1.  Abra a pasta do seu projeto (`ipass-scut`).
2.  Localize o arquivo **`index-final.html`**.
3.  Faça uma cópia dele e renomeie a cópia para **`index.html`**.
    - _Por que?_ Servidores web procuram automaticamente por um arquivo chamado `index.html` para ser a página inicial.

### Passo 2: Publicar

1.  Acesse o site: [**app.netlify.com/drop**](https://app.netlify.com/drop).
2.  Você verá uma área pontilhada dizendo "Drag and drop your site folder here".
3.  **Arraste a pasta inteira** `ipass-scut` para dentro dessa área no navegador.
4.  Aguarde o upload (é rápido).

### Passo 3: Pronto!

- O Netlify vai gerar um link (algo como `agitated-darwin-12345.netlify.app`).
- Você pode clicar nesse link e seu app estará funcionando online!
- (Opcional) Crie uma conta no Netlify para personalizar o nome do link (ex: `scut-ipass.netlify.app`).

---

## ⚠️ IMPORTANTE: Sobre seus Dados

Como este aplicativo salva os dados no **Seu Navegador** (LocalStorage):

1.  **O site publicado começa VAZIO**: Os pacientes que você cadastrou no seu computador **NÃO** aparecerão no site publicado. O site é uma "folha em branco".
2.  **Dados não sincronizam**: Se você usar o app no celular e cadastrar um paciente, ele **NÃO** aparecerá quando você abrir o mesmo site no computador do hospital. Cada dispositivo tem seu próprio banco de dados local.
3.  **API Key**: Você precisará clicar na engrenagem (⚙️) no site publicado e inserir sua chave do Google Gemini novamente, pois ela também fica salva apenas no navegador local.

### Como usar em vários dispositivos?

Se você precisa que os dados cadastrados no celular apareçam no computador, seria necessário **criar um Banco de Dados Online** (Backend), o que envolve aluguel de servidor e programação mais complexa, saindo do modelo de "app estático gratuito".

Por enquanto, o app publicado serve como uma ferramenta que você pode acessar de qualquer lugar, mas os dados ficam restritos ao aparelho que você está usando naquele momento.
