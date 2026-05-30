import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

/**
 * Formulário CRUD para criar/editar projetos com validação avançada de campos e tipos.
 */
const ProjectForm = ({ onSubmit, initialData = null, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    status: "Concluído",
    imageUrl: "",
    demoUrl: "",
    repositoryUrl: "",
    featured: false,
    order: 0
  });
  
  const [techInput, setTechInput] = useState("");

  // Carrega os dados se estiver editando um projeto existente
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
        category: initialData.category || "",
        status: initialData.status || "Concluído",
        imageUrl: initialData.imageUrl || "",
        demoUrl: initialData.demoUrl || "",
        repositoryUrl: initialData.repositoryUrl || "",
        featured: !!initialData.featured,
        order: Number(initialData.order) || 0
      });
      setTechInput(initialData.technologies ? initialData.technologies.join(", ") : "");
    } else {
      // Reseta form para nova criação
      setFormData({
        title: "",
        shortDescription: "",
        description: "",
        category: "",
        status: "Concluído",
        imageUrl: "",
        demoUrl: "",
        repositoryUrl: "",
        featured: false,
        order: 0
      });
      setTechInput("");
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Converte e limpa tecnologias separadas por vírgula em array de strings
    const technologiesArray = techInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");

    // Passa os dados estruturados para a função de submissão do parent
    onSubmit({
      ...formData,
      technologies: technologiesArray
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="brutal-card" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "1.2rem", 
        backgroundColor: "var(--panel-color)"
      }}
    >
      <h3 
        style={{ 
          fontSize: "1.3rem", 
          marginBottom: "0.5rem", 
          fontFamily: "var(--font-header)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          borderBottom: "1px solid var(--border-color)", 
          paddingBottom: "0.75rem" 
        }}
      >
        <span>{initialData ? "Editar Projeto" : "Novo Projeto"}</span>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="brutal-btn brutal-btn-secondary" 
            style={{ padding: "0.3rem 0.6rem" }}
            aria-label="Fechar formulário"
          >
            <X size={14} />
          </button>
        )}
      </h3>

      {/* Título */}
      <div className="form-group">
        <label className="brutal-label" htmlFor="title">Título do Projeto *</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="brutal-input"
          placeholder="Ex: Web Scraper Distribuído"
        />
      </div>

      {/* Categoria e Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label className="brutal-label" htmlFor="category">Categoria *</label>
          <input
            type="text"
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="brutal-input"
            placeholder="Ex: Backend, CLI, Fullstack"
          />
        </div>
        <div className="form-group">
          <label className="brutal-label" htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="brutal-select"
          >
            <option value="Concluído">Concluído</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Planejado">Planejado</option>
          </select>
        </div>
      </div>

      {/* Tecnologias */}
      <div className="form-group">
        <label className="brutal-label" htmlFor="techInput">Tecnologias * (separadas por vírgula)</label>
        <input
          type="text"
          id="techInput"
          required
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          className="brutal-input"
          placeholder="Ex: Golang, Redis, Docker, gRPC"
        />
      </div>

      {/* Descrição Curta */}
      <div className="form-group">
        <label className="brutal-label" htmlFor="shortDescription">Descrição Curta * (resumo para o card)</label>
        <input
          type="text"
          id="shortDescription"
          name="shortDescription"
          required
          value={formData.shortDescription}
          onChange={handleChange}
          className="brutal-input"
          placeholder="Resumo do projeto de 1 ou 2 frases"
        />
      </div>

      {/* Descrição Longa */}
      <div className="form-group">
        <label className="brutal-label" htmlFor="description">Descrição Completa * (detalhada)</label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          className="brutal-textarea"
          rows="4"
          placeholder="Detalhamento técnico da arquitetura, desafios superados e features implementadas..."
        ></textarea>
      </div>

      {/* URL da Imagem */}
      <div className="form-group">
        <label className="brutal-label" htmlFor="imageUrl">URL da Imagem / Thumbnail *</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          required
          value={formData.imageUrl}
          onChange={handleChange}
          className="brutal-input"
          placeholder="https://exemplo.com/thumb.webp"
        />
      </div>

      {/* Repositório e Deploy */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label className="brutal-label" htmlFor="repositoryUrl">URL do Código (GitHub)</label>
          <input
            type="url"
            id="repositoryUrl"
            name="repositoryUrl"
            value={formData.repositoryUrl}
            onChange={handleChange}
            className="brutal-input"
            placeholder="https://github.com/..."
          />
        </div>
        <div className="form-group">
          <label className="brutal-label" htmlFor="demoUrl">URL de Demonstração (Deploy)</label>
          <input
            type="url"
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            className="brutal-input"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Ordem de exibição e Destaque */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "center" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="brutal-label" htmlFor="order">Ordem numérica (Exibição)</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="brutal-input"
            min="0"
          />
        </div>
        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: 0, height: "45px", paddingTop: "0.8rem" }}>
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--color-primary)" }}
          />
          <label htmlFor="featured" className="brutal-label" style={{ margin: 0, cursor: "pointer" }}>
            Destacar Projeto
          </label>
        </div>
      </div>

      {/* Ações de Submissão */}
      <div 
        style={{ 
          display: "flex", 
          gap: "1rem", 
          marginTop: "1.2rem", 
          borderTop: "1px solid var(--border-color)", 
          paddingTop: "1.2rem" 
        }}
      >
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="brutal-btn brutal-btn-secondary" 
            style={{ flexGrow: 1 }}
            disabled={isSubmitting}
          >
            <span>Cancelar</span>
          </button>
        )}
        <button 
          type="submit" 
          className="brutal-btn brutal-btn-primary" 
          style={{ flexGrow: 2 }}
          disabled={isSubmitting}
        >
          <Save size={14} />
          <span>{isSubmitting ? "Gravando..." : "Gravar Dados"}</span>
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
