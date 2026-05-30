import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import ProjectForm from "../components/ProjectForm";
import { LogIn, LogOut, Plus, Edit2, Trash2, Home as HomeIcon, AlertTriangle, CheckCircle, Terminal } from "lucide-react";

/**
 * Página administrativa do painel. Fornece controle de login e CRUD.
 */
const Admin = () => {
  const { user, loading: authLoading, error: authError, loginWithGoogle, logout, setError } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Controle de alertas/toasts
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Timeout de tolerância para destravar a tela caso a inicialização do Firebase demore ou trave
  const [authTimeoutPassed, setAuthTimeoutPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthTimeoutPassed(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Busca projetos do Firestore para a tabela
  const fetchProjects = async () => {
    if (!user) return;
    setProjectsLoading(true);
    try {
      const q = query(collection(db, "projects"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(data);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      showToast("Falha ao carregar projetos do banco de dados.", "error");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Ação de criar ou editar projeto
  const handleFormSubmit = async (projectData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && currentProject) {
        // Modo Edição
        const projectRef = doc(db, "projects", currentProject.id);
        
        // Remove 'createdAt' para não sobrescrever a data original de criação
        const { createdAt, ...updatedFields } = projectData;

        await updateDoc(projectRef, {
          ...updatedFields,
          updatedAt: serverTimestamp()
        });

        showToast("Projeto atualizado com sucesso!");
      } else {
        // Modo Criação
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        showToast("Projeto cadastrado com sucesso!");
      }
      
      // Reseta estados e atualiza lista
      setIsEditing(false);
      setCurrentProject(null);
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error("Erro ao gravar projeto:", error);
      showToast("Erro ao gravar projeto. Verifique as regras de segurança.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ação de excluir projeto
  const handleDelete = async (projectId) => {
    if (window.confirm("Deseja realmente excluir este projeto permanentemente?")) {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        showToast("Projeto removido com sucesso!");
        fetchProjects();
      } catch (error) {
        console.error("Erro ao remover projeto:", error);
        showToast("Erro ao remover projeto. Acesso negado.", "error");
      }
    }
  };

  // Prepara formulário para edição
  const handleEditClick = (project) => {
    setCurrentProject(project);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancela o formulário
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProject(null);
    setShowForm(false);
  };

  // Renderiza loading inicial da autenticação apenas se o timeout de tolerância ainda não passou e não temos usuário
  if (authLoading && !authTimeoutPassed && !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--bg-color)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--color-primary)", display: "flex", gap: "0.5rem" }}>
          <span className="skeleton-box" style={{ width: "20px", height: "20px" }}></span>
          <span>AUTENTICANDO_SESSAO...</span>
        </div>
      </div>
    );
  }

  // TELA DE LOGIN (Se não estiver autenticado)
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1.5rem", backgroundColor: "var(--bg-color)" }}>
        
        {/* Toast de erro de login */}
        {authError && (
          <div className="brutal-toast" style={{ borderColors: "#EF4444" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={16} style={{ color: "#EF4444" }} />
              <span>{authError}</span>
            </div>
          </div>
        )}

        <div className="brutal-card" style={{ maxWidth: "450px", width: "100%", textAlign: "center", padding: "2.5rem 2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", color: "var(--color-primary)" }}>
            <Terminal size={40} />
          </div>
          
          <h2 style={{ fontSize: "1.5rem", textTransform: "uppercase", marginBottom: "1rem", fontFamily: "var(--font-header)" }}>
            Console Administrativo
          </h2>
          
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
            Esta área é restrita. Faça login com a conta Google configurada como administrador para gerenciar seus projetos do portfólio.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button 
              onClick={loginWithGoogle} 
              className="brutal-btn brutal-btn-primary" 
              style={{ width: "100%" }}
              disabled={authLoading && !authTimeoutPassed}
            >
              <LogIn size={16} />
              <span>{authLoading && !authTimeoutPassed ? "Verificando..." : "Login com Google"}</span>
            </button>
            
            <Link to="/" className="brutal-btn brutal-btn-secondary" style={{ width: "100%" }}>
              <HomeIcon size={16} />
              <span>Voltar ao Portfólio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // PAINEL ADMINISTRATIVO (Se estiver autenticado com UID correto)
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Toast flutuante de sucesso / erro */}
      {toast.show && (
        <div className={`brutal-toast ${toast.type === "success" ? "brutal-toast-success" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {toast.type === "success" ? (
              <CheckCircle size={16} style={{ color: "var(--color-primary)" }} />
            ) : (
              <AlertTriangle size={16} style={{ color: "#EF4444" }} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Admin */}
      <header style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--panel-color)" }}>
        <div className="hud-container" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--color-primary)" }}>
            <Terminal size={16} />
            <span>SYS_ADMIN // CONSOLE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "none", md: "inline" }}>
              {user.email}
            </span>
            <button onClick={logout} className="brutal-btn brutal-btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>
              <LogOut size={12} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="hud-container" style={{ flexGrow: 1, padding: "3rem 1.5rem" }}>
        
        {/* Caminho de navegação */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.75rem", textTransform: "uppercase", fontFamily: "var(--font-header)" }}>
              Gerenciador de Projetos
            </h2>
            <Link to="/" style={{ fontSize: "0.8rem", color: "var(--color-primary)", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "0.2rem", marginTop: "0.25rem" }}>
              <HomeIcon size={12} /> Voltar para o site público
            </Link>
          </div>
          
          {!showForm && (
            <button onClick={() => { setIsEditing(false); setShowForm(true); }} className="brutal-btn brutal-btn-primary">
              <Plus size={14} />
              <span>Novo Projeto</span>
            </button>
          )}
        </div>

        {/* Renderiza Formulário de Criação/Edição */}
        {showForm && (
          <div style={{ marginBottom: "3rem" }}>
            <ProjectForm
              onSubmit={handleFormSubmit}
              initialData={currentProject}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Tabela/Lista Brutal de Projetos */}
        <div className="brutal-card" style={{ padding: 0, overflowX: "auto" }}>
          <div style={{ borderBottom: "1px solid var(--border-color)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", backgroundColor: "hsl(223, 39%, 8%)", fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
            <span>PROJETOS_CADASTRADOS</span>
            <span>[{projects.length} registros]</span>
          </div>

          {projectsLoading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>CARREGANDO_REGISTROS...</span>
            </div>
          ) : projects.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "hsl(223, 39%, 7%)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  <th style={{ padding: "1rem 1.5rem" }}>Ordem</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Título</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Categoria</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Destaque</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "var(--transition-spring)" }} className="table-row-hover">
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "var(--font-mono)" }}>{project.order}</td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-main)" }}>{project.title}</td>
                    <td style={{ padding: "1rem 1.5rem" }}><span className="tag-pill">{project.category}</span></td>
                    <td style={{ padding: "1rem 1.5rem" }}>{project.status}</td>
                    <td style={{ padding: "1rem 1.5rem", color: project.featured ? "var(--color-primary)" : "var(--text-muted)" }}>
                      {project.featured ? "SIM" : "NÃO"}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEditClick(project)}
                          className="brutal-btn brutal-btn-secondary"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.7rem", borderColor: "var(--border-color)" }}
                          title="Editar Projeto"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="brutal-btn brutal-btn-danger"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.7rem" }}
                          title="Excluir Projeto"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <AlertTriangle size={32} style={{ color: "var(--color-secondary)", marginBottom: "0.75rem" }} />
              <p style={{ fontSize: "0.95rem" }}>Nenhum projeto cadastrado no Firestore.</p>
              <button 
                onClick={() => { setIsEditing(false); setShowForm(true); }} 
                className="brutal-btn brutal-btn-primary" 
                style={{ marginTop: "1rem", fontSize: "0.8rem" }}
              >
                Cadastrar Primeiro Projeto
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
