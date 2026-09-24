import { useState, type FormEvent } from "react";
import type { DadosProduto, Produto } from "../../types/produto";

type Props = {
  inicial?: Produto;
  ocupado?: boolean;
  onSalvar: (dados: DadosProduto) => Promise<void>;
};

export default function FormularioProduto({
  inicial,
  ocupado = false,
  onSalvar
}: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? "");

  const [preco, setPreco] = useState(
    inicial ? String(inicial.preco) : ""
  );

  const [descricao, setDescricao] = useState(
    inicial?.descricao ?? ""
  );

  const [avatar, setAvatar] = useState(
    inicial?.avatar ?? ""
  );

  const [estoque, setEstoque] = useState(
    inicial ? String(inicial.estoque) : ""
  );

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (salvando || ocupado) {
      return;
    }

    setErro("");

    const valorPreco = Number(preco);
    const valorEstoque = Number(estoque);

    if (nome.trim() === "") {
      setErro("Digite o nome do produto.");
      return;
    }

    if (
      preco.trim() === "" ||
      !Number.isFinite(valorPreco) ||
      valorPreco < 0
    ) {
      setErro("Digite um preço válido.");
      return;
    }

    if (descricao.trim() === "") {
      setErro("Digite uma descrição.");
      return;
    }

    if (avatar.trim() === "") {
      setErro("Digite a URL da imagem.");
      return;
    }

    if (
      estoque.trim() === "" ||
      !Number.isInteger(valorEstoque) ||
      valorEstoque < 0
    ) {
      setErro("Digite uma quantidade válida para o estoque.");
      return;
    }

    setSalvando(true);

    try {
      await onSalvar({
        nome: nome.trim(),
        preco: valorPreco,
        descricao: descricao.trim(),
        avatar: avatar.trim(),
        estoque: valorEstoque
      });

      if (!inicial) {
        setNome("");
        setPreco("");
        setDescricao("");
        setAvatar("");
        setEstoque("");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível salvar o produto.");
      }
    } finally {
      setSalvando(false);
    }
  }

  const estiloLabel = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "7px",
    fontWeight: "600",
    color: "#333",
    fontSize: "14px"
  };

  const estiloInput = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: "8px",
    border: "1px solid #cccccc",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const
  };

  return (
    <form
      onSubmit={enviar}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px"
        }}
      >
        <label style={estiloLabel}>
          Nome do produto

          <input
            type="text"
            value={nome}
            onChange={function (event) {
              setNome(event.target.value);
            }}
            placeholder="Ex: Mochila SoulPass"
            required
            disabled={salvando || ocupado}
            style={estiloInput}
          />
        </label>

        <label style={estiloLabel}>
          Preço

          <input
            type="number"
            value={preco}
            onChange={function (event) {
              setPreco(event.target.value);
            }}
            placeholder="Ex: 99.90"
            min="0"
            step="0.01"
            required
            disabled={salvando || ocupado}
            style={estiloInput}
          />
        </label>

        <label style={estiloLabel}>
          Estoque

          <input
            type="number"
            value={estoque}
            onChange={function (event) {
              setEstoque(event.target.value);
            }}
            placeholder="Ex: 10"
            min="0"
            step="1"
            required
            disabled={salvando || ocupado}
            style={estiloInput}
          />
        </label>

        <label style={estiloLabel}>
          URL da imagem

          <input
            type="text"
            value={avatar}
            onChange={function (event) {
              setAvatar(event.target.value);
            }}
            placeholder="https://..."
            required
            disabled={salvando || ocupado}
            style={estiloInput}
          />
        </label>
      </div>

      <label style={estiloLabel}>
        Descrição

        <textarea
          value={descricao}
          onChange={function (event) {
            setDescricao(event.target.value);
          }}
          placeholder="Digite uma descrição para o produto..."
          rows={4}
          required
          disabled={salvando || ocupado}
          style={{
            ...estiloInput,
            resize: "vertical",
            minHeight: "100px",
            fontFamily: "Arial, sans-serif"
          }}
        />
      </label>

      {avatar.trim() !== "" && (
        <div>
          <p
            style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
              fontSize: "14px"
            }}
          >
            Pré-visualização da imagem
          </p>

          <div
            style={{
              width: "160px",
              height: "120px",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #ddd",
              backgroundColor: "#f5f5f5"
            }}
          >
            <img
              src={avatar}
              alt="Pré-visualização do produto"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>
        </div>
      )}

      {erro && (
        <div
          role="alert"
          style={{
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#ffe5e5",
            color: "#a10000",
            border: "1px solid #ffb6b6"
          }}
        >
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={salvando || ocupado}
        style={{
          width: "100%",
          padding: "13px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#661917",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: salvando || ocupado ? "not-allowed" : "pointer",
          opacity: salvando || ocupado ? 0.6 : 1
        }}
      >
        {salvando
          ? "Salvando..."
          : inicial
            ? "Salvar alterações"
            : "Cadastrar produto"}
      </button>
    </form>
  );
}