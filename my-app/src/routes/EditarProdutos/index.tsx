import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import FormularioProduto from "../../components/FormularioProduto";

import {
  atualizarProduto,
  buscarProduto
} from "../../services/produtos";

import type {
  DadosProduto,
  Produto
} from "../../types/produto";

export default function EditarProdutos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    setCarregando(true);
    setErro("");
    setProduto(null);

    async function carregar() {
      try {
        if (!id) {
          throw new Error("Identificador do produto ausente.");
        }

        const encontrado = await buscarProduto(
          id,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setProduto(encontrado);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          if (error instanceof Error) {
            setErro(error.message);
          } else {
            setErro("Falha ao consultar o produto.");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return function limpar() {
      controller.abort();
    };
  }, [id]);

  async function salvar(
    dados: DadosProduto
  ): Promise<void> {
    if (!id) {
      throw new Error("Identificador do produto ausente.");
    }

    await atualizarProduto(id, dados);

    navigate("/produtos");
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          marginBottom: "30px"
        }}
      >
        <h1
          style={{
            margin: "0 0 8px 0",
            color: "#661917",
            fontSize: "32px"
          }}
        >
          Editar produto
        </h1>

        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "15px"
          }}
        >
          Altere as informações do produto e salve as mudanças.
        </p>
      </div>

      {carregando && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            color: "#666"
          }}
        >
          Carregando produto...
        </div>
      )}

      {erro && (
        <div
          role="alert"
          style={{
            backgroundColor: "#ffe5e5",
            color: "#a10000",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ffb8b8",
            marginBottom: "20px"
          }}
        >
          {erro}
        </div>
      )}

      {!carregando && produto && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dddddd",
            borderRadius: "14px",
            padding: "25px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
          }}
        >
          <div
            style={{
              marginBottom: "25px",
              paddingBottom: "20px",
              borderBottom: "1px solid #eeeeee"
            }}
          >
            <h2
              style={{
                margin: "0 0 5px 0",
                color: "#333",
                fontSize: "22px"
              }}
            >
              {produto.nome}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
                fontSize: "14px"
              }}
            >
              Edite os dados abaixo.
            </p>
          </div>

          <FormularioProduto
            key={produto.id}
            inicial={produto}
            onSalvar={salvar}
          />
        </div>
      )}

      <div
        style={{
          marginTop: "25px"
        }}
      >
        <Link
          to="/produtos"
          style={{
            display: "inline-block",
            color: "#661917",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          ← Voltar para produtos
        </Link>
      </div>
    </main>
  );
}

