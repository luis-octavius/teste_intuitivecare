<template>
  <div class="operadoras-view">
    <h1 class="view-title">Lista de Operadoras</h1>

    <OperadorasTable
      :operadoras="store.operadorasFiltradas"
      :loading="store.loading"
      :error="store.error"
      :filtros="store.filtros"
      :total-pages="store.totalPages"
      :total-items="store.totalOperadoras"
      @update-filters="updateAndFetchOperadoras"
      @change-page="changePageAndFetchOperadoras"
      @view-details="viewOperadoraDetails"
    />

    <router-view></router-view> <!-- Render OperadoraDetalhe here -->
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useOperadorasStore } from '@/stores/operadorasStore'
import OperadorasTable from '@/components/OperadorasTable.vue'
import { useRouter } from 'vue-router'

const store = useOperadorasStore()
const router = useRouter()

const fetchOperadorasData = async () => {
  try {
    await store.fetchOperadoras()
    console.log('OperadorasView: store.operadorasFiltradas after fetch:', store.operadorasFiltradas.value);
    console.log('OperadorasView: store.operadoras after fetch:', store.operadoras.value);
  } catch (err) {
    console.error("Erro ao buscar operadoras:", err)
  }
}

const updateAndFetchOperadoras = (newFilters) => {
  store.updateFiltros(newFilters)
  fetchOperadorasData()
}

const changePageAndFetchOperadoras = (page) => {
  store.updateFiltros({ page })
  fetchOperadorasData()
}

const viewOperadoraDetails = (operadora) => {
  router.push(`/operadoras/${operadora.cnpj}`)
}

onMounted(() => {
  fetchOperadorasData()
})

// Optionally watch filters if they can be changed from outside this component
// watch(() => store.filtros, fetchOperadorasData, { deep: true })
</script>

<style scoped>
.operadoras-view {
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.view-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
}
</style>
