<template>
  <div class="error-alert" v-if="show">
    <div class="error-content">
      <span class="error-icon">⚠️</span>
      <div class="error-message">
        <strong>{{ title }}</strong>
        <p>{{ message }}</p>
      </div>
      <button v-if="dismissible" @click="$emit('dismiss')" class="dismiss-btn">
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Erro'
  },
  message: {
    type: String,
    default: 'Ocorreu um erro inesperado.'
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

defineEmits(['dismiss'])
</script>

<style scoped>
.error-alert {
  background-color: #fee;
  border: 1px solid #f66;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 16px 0;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.error-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.error-message {
  flex-grow: 1;
}

.error-message strong {
  color: #c00;
  display: block;
  margin-bottom: 4px;
}

.error-message p {
  margin: 0;
  color: #333;
  font-size: 14px;
}

.dismiss-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1;
}

.dismiss-btn:hover {
  color: #666;
}
</style>
