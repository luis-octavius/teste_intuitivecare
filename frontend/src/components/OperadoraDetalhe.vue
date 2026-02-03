<template>
    <div class="operadora-detalhe-overlay" @click.self="closeDetails">
        <div class="operadora-detalhe-card">
            <button class="close-button" @click="closeDetails">×</button>
            <h2 class="detalhe-title">Detalhes da Operadora</h2>

            <LoadingSpinner v-if="store.loading" size="medium" />
            <ErrorAlert
                v-else-if="store.error"
                :message="store.error"
                @dismiss="store.clearError"
            />

            <div v-else-if="store.operadoraDetalhe" class="detalhe-content">
                <div class="detalhe-section">
                    <h3>Informações Gerais</h3>
                    <p>
                        <strong>Razão Social:</strong>
                        {{ store.operadoraDetalhe.razao_social }}
                    </p>
                    <p>
                        <strong>CNPJ:</strong>
                        {{ formatCNPJ(store.operadoraDetalhe.cnpj) }}
                    </p>
                    <p>
                        <strong>Registro ANS:</strong>
                        {{ store.operadoraDetalhe.registro_operadora }}
                    </p>
                    <p>
                        <strong>Modalidade:</strong>
                        {{ store.operadoraDetalhe.modalidade }}
                    </p>
                    <p>
                        <strong>Endereço:</strong>
                        {{ endereco }}
                    </p>
                    <p>
                        <strong>Cidade:</strong>
                        {{ store.operadoraDetalhe.cidade }}
                    </p>
                    <p><strong>UF:</strong> {{ store.operadoraDetalhe.uf }}</p>
                    <p>
                        <strong>Email:</strong>
                        {{ store.operadoraDetalhe.endereco_eletronico }}
                    </p>
                    <p>
                        <strong>DDD:</strong>
                        {{ store.operadoraDetalhe.ddd }}
                    </p>
                    <p>
                        <strong>Telefone:</strong>
                        {{ store.operadoraDetalhe.telefone }}
                    </p>
                </div>

                <!-- <div class="detalhe-section">
                    <h3>Período de Análise</h3>
                    <p>
                        <strong>Data Início:</strong>
                        {{ formatDate(store.operadoraDetalhe.data_inicio) }}
                    </p>
                    <p>
                        <strong>Data Fim:</strong>
                        {{ formatDate(store.operadoraDetalhe.data_fim) }}
                    </p>
                </div> -->

                <div class="detalhe-section">
                    <h3>Despesas Detalhadas (Últimos 12 meses)</h3>
                    <h4 class="detalhe-explanation">
                        Ano / Valor / Tipo de Despesa
                    </h4>
                    <div v-if="store.despesas.length > 0">
                        <ul class="despesas-list">
                            <li
                                v-for="despesa in store.despesas"
                                :key="despesa.id"
                            >
                                {{ despesa.ano }}: R$
                                {{ despesa.valor_despesas }} ({{
                                    despesa.cd_conta_contabil
                                }})
                            </li>
                        </ul>
                    </div>
                    <p v-else>Nenhuma despesa detalhada disponível.</p>
                </div>
            </div>
            <p v-else>Nenhuma informação detalhada para esta operadora.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOperadorasStore } from "@/stores/operadorasStore";
import LoadingSpinner from "./LoadingSpinner.vue";
import ErrorAlert from "./ErrorAlert.vue";

const props = defineProps({
    cnpj: {
        type: String,
        required: true,
    },
});

const store = useOperadorasStore();
const route = useRoute();
const router = useRouter();
const endereco = [
    store.operadoraDetalhe?.numero,
    store.operadoraDetalhe?.logradouro,
    store.operadoraDetalhe?.bairro,
    store.operadoraDetalhe?.cidade,
    store.operadoraDetalhe?.cep,
].join(", ");

const fetchOperadoraData = async (cnpj) => {
    if (cnpj) {
        try {
            await store.fetchOperadoraDetalhe(cnpj);
            await store.fetchDespesas(cnpj);
        } catch (err) {
            console.error("Erro ao carregar detalhes da operadora:", err);
            // O erro já é tratado no store.error
        }
    }
};

const formatCNPJ = (cnpj) => {
    if (!cnpj) return "";
    const clean = String(cnpj).replace(/\D/g, "");
    return clean.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5",
    );
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
};

const closeDetails = () => {
    router.push("/operadoras");
};

onMounted(() => {
    fetchOperadoraData(props.cnpj);
});

watch(
    () => props.cnpj,
    (newCnpj) => {
        fetchOperadoraData(newCnpj);
    },
);
</script>

<style scoped>
.operadora-detalhe-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.detalhe-explanation {
    color: #34495e;
    text-align: left;
    margin-bottom: 2rem;
    font-size: 0.8rem;
}

.operadora-detalhe-card {
    background: white;
    padding: 2.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: slideIn 0.3s ease-out forwards;
}

.close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: #34495e;
    cursor: pointer;
    line-height: 1;
    padding: 0.5rem;
}

.close-button:hover {
    color: #e74c3c;
}

.detalhe-title {
    color: #2c3e50;
    text-align: left;
    margin-bottom: 2rem;
    font-size: 2rem;
}

.detalhe-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
}

.detalhe-section {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.detalhe-section h3 {
    color: #34495e;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
}

.detalhe-section p {
    margin-bottom: 0.5rem;
    color: #555;
}

.detalhe-section strong {
    color: #2c3e50;
}

.despesas-list {
    list-style: none;
    padding: 0;
}

.despesas-list li {
    background-color: #e9ecef;
    margin-bottom: 0.5rem;
    padding: 0.7rem 1rem;
    border-radius: 5px;
    color: #495057;
    font-size: 0.95rem;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
