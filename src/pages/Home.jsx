import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProjectCard from "../components/ProjectCard";
import { Mail, ShieldAlert, Terminal, ArrowRight } from "lucide-react";

// Ícones de marcas desenhados em SVG estilo contorno do Lucide
const GithubIcon = ({ size = 20 }) => (
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

const LinkedinIcon = ({ size = 20 }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/**
 * Página principal pública do Portfólio.
 */
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Ordena apenas pelo campo 'order' para evitar a exigência de índices compostos manuais no Firebase Spark
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(data);
      } catch (error) {
        console.error("Erro ao buscar projetos do Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Header HUD / Barra Superior */}
      <header 
        style={{ 
          borderBottom: "1px solid var(--border-color)", 
          backgroundColor: "var(--panel-color)",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <div className="hud-container" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--color-primary)" }}>
            <Terminal size={16} />
            <span>DEV_SHELL // PORTFOLIO</span>
          </div>
          <nav style={{ display: "flex", gap: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase" }}>
            <a href="#about" className="nav-link" style={{ transition: "var(--transition-spring)" }}>_sobre</a>
            <a href="#projects" className="nav-link" style={{ transition: "var(--transition-spring)" }}>_projetos</a>
            <a href="#contact" className="nav-link" style={{ transition: "var(--transition-spring)" }}>_contato</a>
          </nav>
        </div>
      </header>

      {/* Seção Hero - Design Assimétrico Brutalista com Tipografia Maciça */}
      <section 
        id="about" 
        style={{ 
          borderBottom: "1px solid var(--border-color)", 
          padding: "5rem 0", 
          position: "relative",
          backgroundImage: "linear-gradient(rgba(31, 41, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 41, 55, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        <div className="hud-container" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Inicial do Desenvolvedor com caixa nítida substituindo avatar clichê */}
          <div 
            style={{ 
              width: "80px", 
              height: "80px", 
              border: "2px solid var(--color-primary)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "2.5rem",
              fontFamily: "var(--font-header)",
              color: "var(--color-primary)",
              fontWeight: "700",
              backgroundColor: "var(--panel-color)",
              boxShadow: "4px 4px 0px var(--color-primary-glow)"
            }}
          >
            FS
          </div>

          {/* Título tipográfico descentralizado */}
          <div style={{ maxWidth: "800px" }}>
            <h1 
              style={{ 
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
                lineHeight: "1.05", 
                fontFamily: "var(--font-header)", 
                marginBottom: "1.5rem",
                textTransform: "uppercase"
              }}
            >
              Arquitetando soluções <span style={{ color: "var(--color-primary)" }}>web</span> escaláveis.
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "var(--text-muted)", fontWeight: "300", lineHeight: "1.7" }}>
              Olá, eu sou um engenheiro full-stack focado em construir aplicações modernas, velozes e seguras. Minha especialidade é integrar sistemas escaláveis com bancos de dados em tempo real e arquiteturas limpas.
            </p>
          </div>

          {/* Botões de Ação e Redes */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
            <a href="#projects" className="brutal-btn brutal-btn-primary">
              <span>Ver Projetos</span>
              <ArrowRight size={14} />
            </a>
            <div style={{ display: "flex", gap: "1rem", marginLeft: "1rem" }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", transition: "var(--transition-spring)" }} className="social-icon">
                <GithubIcon size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", transition: "var(--transition-spring)" }} className="social-icon">
                <LinkedinIcon size={20} />
              </a>
              <a href="mailto:email@exemplo.com" style={{ color: "var(--text-muted)", transition: "var(--transition-spring)" }} className="social-icon">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Projetos */}
      <section id="projects" style={{ flexGrow: 1, padding: "5rem 0", borderBottom: "1px solid var(--border-color)" }}>
        <div className="hud-container">
          <div style={{ marginBottom: "3rem", borderLeft: "2px solid var(--color-primary)", paddingLeft: "1rem" }}>
            <h2 style={{ fontSize: "2rem", textTransform: "uppercase", fontFamily: "var(--font-header)" }}>
              Projetos Desenvolvidos
            </h2>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              [total_projects: {projects.length}]
            </span>
          </div>

          {/* Grid de Projetos com layout assimétrico no carregamento/cards */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              <ProjectCard isLoading={true} />
              <ProjectCard isLoading={true} />
              <ProjectCard isLoading={true} />
            </div>
          ) : projects.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            // Estado Vazio Estilizado
            <div 
              className="brutal-card" 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                padding: "4rem 2rem",
                textAlign: "center",
                gap: "1rem"
              }}
            >
              <ShieldAlert size={48} style={{ color: "var(--color-secondary)" }} />
              <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-header)" }}>Nenhum projeto registrado no momento.</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "450px" }}>
                A base de dados do Firestore está vazia. O administrador do sistema precisa efetuar login e registrar os projetos.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Rodapé / Footer com Botão Admin Oculto */}
      <footer style={{ backgroundColor: "var(--panel-color)", borderTop: "1px solid var(--border-color)", marginTop: "auto" }}>
        <div 
          className="hud-container" 
          style={{ 
            padding: "1.5rem", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)"
          }}
        >
          <div>
            <span>© {new Date().getFullYear()} FS. Desenvolvido com React & Firebase Spark.</span>
          </div>
          
          {/* Botão de Admin sutil integrado em estilo console */}
          <div>
            <Link 
              to="/admin" 
              style={{ 
                color: "var(--border-color)", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "0.3rem",
                transition: "var(--transition-spring)"
              }}
              className="admin-footer-btn"
              title="Área Administrativa"
            >
              <span>[sys_lock]</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
