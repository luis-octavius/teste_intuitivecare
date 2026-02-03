/**
 * Serviço Axios para comunicação com a API
 */
import axios from "axios";
import { useRouter } from "vue-router";

// Configuração base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/",
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    // Adicionar token se existir
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar timestamp para evitar cache
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // const router = useRouter() // Removed: useRouter cannot be called here

    console.error("[API Response Error]", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });

    // Tratamento de erros específicos
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Não autorizado - logar erro para ser tratado no componente chamador
          localStorage.removeItem("auth_token");
          console.error("Erro de autenticação: Redirecionamento para login necessário.");
          // router.push("/login") // Removed: useRouter cannot be called here
          break;

        case 403:
          // Proibido
          console.error("Acesso proibido:", data.message);
          break;

        case 404:
          // Não encontrado
          console.error("Recurso não encontrado:", data.message);
          break;

        case 429:
          // Muitas requisições
          console.error("Muitas requisições. Aguarde...");
          break;

        case 500:
          // Erro interno do servidor
          console.error("Erro interno do servidor:", data.message);
          break;

        default:
          console.error(`Erro ${status}:`, data.message);
      }
    } else if (error.request) {
      // Erro de rede
      console.error("Erro de rede. Verifique sua conexão.");
    } else {
      // Erro na configuração
      console.error("Erro na configuração da requisição:", error.message);
    }

    return Promise.reject(error);
  },
);

// Métodos utilitários
const apiService = {
  // Operadoras
  async getOperadoras(params = {}) {
    const response = await api.get("/api/operadoras", { params });
    return response.data;
  },

  async getOperadora(cnpj) {
    const response = await api.get(`/api/operadoras/${cnpj}`);
    return response.data;
  },

  async getDespesasOperadora(cnpj, params = {}) {
    const response = await api.get(`/api/operadoras/${cnpj}/despesas`, {
      params,
    });
    return response.data;
  },

  // Estatísticas
  async getEstatisticas() {
    const requestPromise = api.get("/api/estatisticas"); // Get the promise
    console.log("api.js: getEstatisticas - requestPromise:", requestPromise);

    return requestPromise.then(response => {
      console.log("api.js: getEstatisticas - Promise resolved with response.data:", response.data);
      return response.data;
    }).catch(error => {
      console.error("api.js: getEstatisticas - Promise rejected with error:", error);
      throw error; // Re-throw to propagate the error
    });
  },

  // Busca
  async buscarOperadoras(query) {
    const response = await api.get("/api/buscar", { params: { q: query } });
    return response.data;
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get("/health", { timeout: 5000 });
      return { healthy: true, data: response.data };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  },
};

export default apiService;
