# Como adicionar fotos no site

Coloque cada foto na pasta da categoria certa. O site atualiza sozinho no próximo deploy (Vercel/GitHub).

## Pastas

| Pasta | Aparece em |
|-------|------------|
| `formatura/` | Formatura |
| `estudio/` | Estúdio |
| `esporte/` | Esporte |
| `eventos/` | Eventos |

## Adicionar uma foto nova

1. Copie o arquivo (`.jpg`, `.jpeg`, `.png` ou `.webp`) para a pasta da categoria.
2. **Opcional:** crie um arquivo `.txt` com o **mesmo nome** da foto, só mudando a extensão, com a descrição que aparece no hover.  
   - Foto: `formatura/01-colacao.jpg`  
   - Legenda: `formatura/01-colacao.txt` → conteúdo: `Colação de medicina ao entardecer`
3. Se não houver `.txt`, o site usa o nome do arquivo como descrição.
4. Para ordenar, use prefixo numérico no nome: `01-foto.jpg`, `02-foto.jpg`.
5. Faça commit no GitHub (ou peça para quem cuida do site publicar).

## Foto de destaque (topo) e seção de contato

Edite `site.json` nesta mesma pasta:

```json
{
  "heroImage": "formatura/DSC_6059-2.JPG",
  "contatoImage": "formatura/DSC_6512.JPG"
}
```

Use o caminho **pasta/nome-do-arquivo** da foto que já está na galeria.

## Formatos aceitos

jpg, jpeg, png, webp, gif, avif