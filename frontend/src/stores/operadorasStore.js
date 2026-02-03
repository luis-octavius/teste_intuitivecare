/**
 * Store Pinia para gerenciamento de estado das operadoras
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";

export const useOperadorasStore = defineStore("operadoras", () => {
  // Estado
  const totalPages = ref(1);
  const operadoras = ref([]);
  const operadoraDetalhe = ref(null);
  const despesas = ref([]);
  const estatisticas = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const filtros = ref({
    page: 1,
    limit: 10,
    razao_social: "",
    uf: "",
    modalidade: "",
  });

  // Getters (computados)
  const totalOperadoras = computed(() => operadoras.value.length);
  const operadorasFiltradas = computed(() => {
    return operadoras.value.filter((op) => {
      const matchRazao = filtros.value.razao_social
        ? op.razao_social
            .toLowerCase()
            .includes(filtros.value.razao_social.toLowerCase())
        : true;

      const matchUF = filtros.value.uf
        ? op.uf === filtros.value.uf.toUpperCase()
        : true;

      const matchModalidade = filtros.value.modalidade
        ? op.modalidade
            ?.toLowerCase()
            .includes(filtros.value.modalidade.toLowerCase())
        : true;

      return matchRazao && matchUF && matchModalidade;
    });
  });

  // Actions
  async function fetchOperadoras(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.getOperadoras({ ...filtros.value, ...params });

      operadoras.value = Array.isArray(response.data) ? response.data : [];
      filtros.value.page = response.page;
      filtros.value.limit = response.limit;
      totalPages.value = response.total_pages;

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Erro ao carregar operadoras";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOperadoraDetalhe(cnpj) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.getOperadora(cnpj);
      operadoraDetalhe.value = response;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao carregar operadora";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchDespesas(cnpj, params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.getDespesasOperadora(cnpj, params);
      despesas.value = response;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao carregar despesas";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchEstatisticas() {
    loading.value = true;
    error.value = null;

    try {
      console.log("operadorasStore.js: Calling api.getEstatisticas()");
      const estatsPromise = api.getEstatisticas(); // Get the promise here
      console.log("operadorasStore.js: Received promise from api.getEstatisticas():", estatsPromise);

      const response = await estatsPromise; // Await the promise
      console.log("operadorasStore.js: Awaited response from api.getEstatisticas():", response);

      estatisticas.value = response;
      return response;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Erro ao carregar estatísticas";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function updateFiltros(novosFiltros) {
    filtros.value = { ...filtros.value, ...novosFiltros };
  }

  function clearError() {
    error.value = null;
  }

  return {
    // Estado
    operadoras,
    operadoraDetalhe,
    despesas,
    estatisticas,
    loading,
    error,
    filtros,
    totalPages,

    // Getters
    totalOperadoras,
    operadorasFiltradas,

    // Actions
    fetchOperadoras,
    fetchOperadoraDetalhe,
    fetchDespesas,
    fetchEstatisticas,
    updateFiltros,
    clearError,
  };
});
