import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

// Ícone do GitHub desenhado em SVG estilo Lucide (removido das versões recentes da biblioteca)
const GithubIcon = ({ size = 12 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/**
 * Componente do Card de Projetos com suporte a Skeleton Loading e Fallback de imagem.
 */
const ProjectCard = ({ project, isLoading = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Renderiza Skeleton se estiver carregando dados
  if (isLoading) {
    return (
      <div className="brutal-card" style={{ minHeight: "330px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="skeleton-box" style={{ height: "180px", width: "100%", margin: "-1.5rem -1.5rem 1rem -1.5rem" }}></div>
        <div className="skeleton-box" style={{ height: "24px", width: "70%" }}></div>
        <div className="skeleton-box" style={{ height: "16px", width: "95%" }}></div>
        <div className="skeleton-box" style={{ height: "16px", width: "85%" }}></div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
          <div className="skeleton-box" style={{ height: "28px", width: "50%", borderRadius: "0px" }}></div>
          <div className="skeleton-box" style={{ height: "28px", width: "50%", borderRadius: "0px" }}></div>
        </div>
      </div>
    );
  }

  const {
    title,
    shortDescription,
    technologies,
    category,
    status,
    imageUrl,
    demoUrl,
    repositoryUrl,
    featured
  } = project;

  // Gerador determinístico de gradientes para thumbnails de fallback (Purple Ban ativado)
  const getFallbackGradient = (text) => {
    const gradients = [
      "linear-gradient(135deg, hsl(158, 80%, 25%) 0%, hsl(158, 80%, 12%) 100%)", // Emerald profundo
      "linear-gradient(135deg, hsl(38, 92%, 35%) 0%, hsl(38, 92%, 18%) 100%)",  // Amber profundo
      "linear-gradient(135deg, hsl(350, 89%, 30%) 0%, hsl(350, 89%, 15%) 100%)", // Crimson profundo
      "linear-gradient(135deg, hsl(180, 75%, 25%) 0%, hsl(180, 75%, 12%) 100%)", // Teal profundo
      "linear-gradient(135deg, hsl(200, 95%, 25%) 0%, hsl(200, 95%, 12%) 100%)"  // Sky profundo
    ];
    if (!text) return gradients[0];
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
      sum += text.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  const initial = title ? title.charAt(0).toUpperCase() : "?";
  const gradient = getFallbackGradient(title);

  return (
    <article 
      className="brutal-card" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%",
        borderColor: featured ? "var(--color-primary)" : "var(--border-color)",
        boxShadow: featured ? "0 0 15px var(--color-primary-glow)" : "none"
      }}
    >
      {/* Área de Mídia */}
      <div 
        style={{ 
          position: "relative", 
          height: "180px", 
          overflow: "hidden", 
          borderBottom: "1px solid var(--border-color)", 
          margin: "-1.5rem -1.5rem 1.2rem -1.5rem", 
          backgroundColor: "var(--bg-color)" 
        }}
      >
        {/* Skeleton de carregamento da imagem */}
        {!imageLoaded && !imageError && imageUrl && (
          <div className="skeleton-box" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}></div>
        )}

        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
            className="project-img"
          />
        ) : (
          // Fallback visual premium em CSS
          <div
            style={{
              width: "100%",
              height: "100%",
              background: gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-main)",
              fontFamily: "var(--font-header)",
              fontSize: "3.5rem",
              fontWeight: "700",
              textShadow: "0 4px 8px rgba(0, 0, 0, 0.4)"
            }}
          >
            {initial}
          </div>
        )}

        {/* Badges de Metadados (Categoria e Status) */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "0.4rem", zIndex: 3 }}>
          <span 
            className="tag-pill" 
            style={{ 
              backgroundColor: "var(--bg-color)", 
              borderColor: "var(--color-primary)", 
              color: "var(--color-primary)" 
            }}
          >
            {category}
          </span>
          <span className="tag-pill" style={{ backgroundColor: "var(--bg-color)" }}>
            {status}
          </span>
        </div>
      </div>

      {/* Conteúdo Escrito */}
      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.6rem", color: "var(--text-main)", fontFamily: "var(--font-header)" }}>
        {title}
      </h3>
      
      <p 
        style={{ 
          fontSize: "0.85rem", 
          marginBottom: "1.2rem", 
          flexGrow: 1, 
          display: "-webkit-box", 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: "vertical", 
          overflow: "hidden",
          color: "var(--text-muted)"
        }}
      >
        {shortDescription}
      </p>

      {/* Tecnologias Utilizadas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
        {technologies && technologies.map((tech, idx) => (
          <span key={idx} className="tag-pill">
            {tech}
          </span>
        ))}
      </div>

      {/* Links de Ação (Código / Deploy) */}
      <div 
        style={{ 
          display: "flex", 
          gap: "0.75rem", 
          marginTop: "auto", 
          borderTop: "1px solid var(--border-color)", 
          paddingTop: "1rem", 
          margin: "auto -1.5rem 0 -1.5rem", 
          paddingLeft: "1.5rem", 
          paddingRight: "1.5rem" 
        }}
      >
        {repositoryUrl && (
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn brutal-btn-secondary"
            style={{ padding: "0.45rem 0.8rem", fontSize: "0.7rem", flexGrow: 1 }}
          >
            <GithubIcon size={12} />
            <span>Código</span>
          </a>
        )}
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn brutal-btn-primary"
            style={{ padding: "0.45rem 0.8rem", fontSize: "0.7rem", flexGrow: 1 }}
          >
            <ExternalLink size={12} />
            <span>Deploy</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
