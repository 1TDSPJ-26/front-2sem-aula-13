import { useEffect, useState } from "react";
import type { TipoProduto } from "../../types/types";

import { Link, useNavigate } from "react-router";
import { CiEdit as Editar} from "react-icons/ci";



export default function Produtos() {
  document.title = "Produtos"
  //  Redirecionador em, crioacao
  const navigate = useNavigate();

  //Estrutura que vai receber a lista, seja ela mocada ou externa!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  


  const [produtos, setProdutos] = useState<TipoProduto[]>([]);

  useEffect(() => {
    setProdutos(listaProdutos);
  }, []);

  return (
    <main>
      <h2>Produtos</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NOME</th>
            <th>PREÇO</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.preco}</td>
              <td><Link to={`/editar-produtos/${p.id}`}><Editar/></Link></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>Quantidade de produtos : {produtos.length}</td>
          </tr>
        </tfoot>
      </table>
    </main>
  );
}
