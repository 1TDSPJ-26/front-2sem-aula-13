import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CiEdit as Editar } from "react-icons/ci";
import { CiTrash as Excluir } from "react-icons/ci";

import FormularioProduto from "../../components/FormularioProduto";

import {
  criarProduto,
  excluirProduto,
  listarProdutos
} from "../../services/produtos";

import type {
  DadosProduto,
  Produto
} from "../../types/produto";

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        setErro("");

        const dados = await listarProdutos(controller.signal);

        if (!controller.signal.aborted) {
          setProdutos(dados);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          if (error instanceof Error) {
            setErro(error.message);
          } else {
            setErro("Falha ao carregar os produtos.");
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
  }, []);

  async function cadastrar(dados: DadosProduto): Promise<void> {
    setOcupado(true);
    setErro("");
    setMensagem("");

    try {
      const criado = await criarProduto(dados);

      setProdutos(function (atuais) {
        return [...atuais, criado];
      });

      setMensagem("Produto cadastrado com sucesso.");
    } finally {
      setOcupado(false);
    }
  }

  async function remover(produto: Produto) {
    if (ocupado) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja excluir o produto ${produto.nome}?`
    );

    if (!confirmar) {
      return;
    }

    setOcupado(true);
    setErro("");
    setMensagem("");

    try {
      await excluirProduto(produto.id);

      setProdutos(function (atuais) {
        return atuais.filter(function (item) {
          return item.id !== produto.id;
        });
      });

      setMensagem("Produto excluído com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Falha ao excluir o produto.");
      }
    } finally {
      setOcupado(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px",
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
          Painel de Produtos
        </h1>

        <p
          style={{
            margin: 0,
            color: "#666"
          }}
        >
          Confira abaixo a lista de itens cadastrados no sistema.
        </p>
      </div>

      {carregando && (
        <p
          style={{
            textAlign: "center",
            color: "#666"
          }}
        >
          Carregando...
        </p>
      )}

      {erro && (
        <div
          style={{
            backgroundColor: "#ffe5e5",
            color: "#a10000",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ffb8b8"
          }}
        >
          {erro}
        </div>
      )}

      {mensagem && (
        <div
          style={{
            backgroundColor: "#e5f7e8",
            color: "#176b28",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #b6e8bf"
          }}
        >
          {mensagem}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "22px"
        }}
      >
        {produtos.map(function (produto) {
          return (
            <div
              key={produto.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid #dddddd",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  backgroundColor: "#f3f3f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {produto.avatar ? (
                  <img
                    src={produto.avatar}
                    alt={produto.nome}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <span
                    style={{
                      color: "#999"
                    }}
                  >
                    Sem imagem
                  </span>
                )}
              </div>

              <div
                style={{
                  padding: "18px"
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "21px",
                    color: "#222"
                  }}
                >
                  {produto.nome}
                </h2>

                <p
                  style={{
                    minHeight: "40px",
                    margin: "0 0 15px 0",
                    color: "#666",
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}
                >
                  {produto.descricao}
                </p>

                <p
                  style={{
                    margin: "0 0 5px 0",
                    color: "#661917",
                    fontSize: "23px",
                    fontWeight: "bold"
                  }}
                >
                  {produto.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </p>

                <p
                  style={{
                    margin: "0 0 18px 0",
                    color: "#777",
                    fontSize: "14px"
                  }}
                >
                  Estoque: {produto.estoque}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >
                  {!ocupado && (
                    <Link
                      to={`/editar-produtos/${produto.id}`}
                      style={{
                        flex: 1,
                        backgroundColor: "#661917",
                        color: "#ffffff",
                        textDecoration: "none",
                        padding: "10px",
                        borderRadius: "7px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "bold"
                      }}
                    >
                      <Editar size={22} />
                      Editar
                    </Link>
                  )}

                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={function () {
                      remover(produto);
                    }}
                    style={{
                      flex: 1,
                      border: "none",
                      backgroundColor: "#c62828",
                      color: "#ffffff",
                      padding: "10px",
                      borderRadius: "7px",
                      cursor: ocupado ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: "bold",
                      opacity: ocupado ? 0.6 : 1
                    }}
                  >
                    <Excluir size={22} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!carregando && !erro && produtos.length === 0 && (
        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            padding: "30px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            color: "#777"
          }}
        >
          Nenhum produto cadastrado.
        </div>
      )}

      <section
        style={{
          marginTop: "50px",
          maxWidth: "650px"
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dddddd",
            borderRadius: "14px",
            padding: "25px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
          }}
        >
          <h2
            style={{
              color: "#661917",
              marginTop: 0,
              marginBottom: "20px"
            }}
          >
            Cadastrar novo produto
          </h2>

          <FormularioProduto
            ocupado={carregando || ocupado}
            onSalvar={cadastrar}
          />
        </div>
      </section>
    </main>
  );
}