<template>
    <div id="app">
        <header class="app-header">
            <nav class="navbar">
                <div class="navbar-brand">
                    <router-link to="/" class="logo">
                        <span class="logo-icon">📊</span>
                        <span class="logo-text">ANS Analytics</span>
                    </router-link>
                </div>
                <div class="navbar-menu">
                    <router-link to="/" class="nav-link">Dashboard</router-link>
                    <router-link to="/operadoras" class="nav-link"
                        >Operadoras</router-link
                    >
                    <router-link to="/estatisticas" class="nav-link"
                        >Estatísticas</router-link
                    >
                </div>
            </nav>
        </header>

        <main class="app-main">
            <!-- Loading global -->
            <div v-if="globalLoading" class="global-loading">
                <LoadingSpinner size="large" />
                <p>Carregando...</p>
            </div>

            <!-- Error global -->
            <ErrorAlert
                v-if="globalError"
                :message="globalError"
                @dismiss="clearGlobalError"
            />

            <!-- Conteúdo principal -->
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>

        <footer class="app-footer">
            <div class="footer-content">
                <p>
                    ANS Analytics &copy; {{ currentYear }} - Sistema de análise
                    de despesas
                </p>
                <div class="footer-links">
                    <a href="http://localhost:8000/docs/" target="_blank"
                        >API Docs</a
                    >
                    <a href="https://www.gov.br/ans" target="_blank"
                        >ANS Oficial</a
                    >
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";

const router = useRouter();

const globalLoading = ref(false);
const globalError = ref(null);
const currentYear = computed(() => new Date().getFullYear());
const apiUrl = ref(import.meta.env.VITE_API_URL);

// Interceptar navegação para loading
router.beforeEach(() => {
    globalLoading.value = true;
});

router.afterEach(() => {
    globalLoading.value = false;
});

router.onError((error) => {
    globalError.value = `Erro de navegação: ${error.message}`;
    globalLoading.value = false;
});

function clearGlobalError() {
    globalError.value = null;
}

// Inicialização
onMounted(() => {
    console.log("ANS Analytics Frontend inicializado");
});
</script>

<style scoped>
#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-header {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
}

.logo-icon {
    margin-right: 0.5rem;
    font-size: 2rem;
}

.navbar-menu {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: bold;
}

.app-main {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 2rem auto;
    padding: 0 1rem;
}

.global-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.app-footer {
    background: #2c3e50;
    color: white;
    padding: 1.5rem 0;
    margin-top: auto;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-links {
    display: flex;
    gap: 1rem;
}

.footer-links a {
    color: #3498db;
    text-decoration: none;
}

.footer-links a:hover {
    text-decoration: underline;
}
</style>
