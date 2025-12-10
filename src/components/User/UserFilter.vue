<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'clear'])

const filters = ref({
    name: '',
    cpf: '',
    from: '',
    to: '',
})

const onSearch = () => {
    emit('search', { ...filters.value })
}

const onClear = () => {
    filters.value = { name: '', cpf: '', from: '', to: '' }
    emit('clear')
}
</script>

<template>
    <div class="filtros">
        <div class="linha-filtro">
            <label>Nome</label>
            <input v-model="filters.name" type="text" placeholder="Buscar por nome" />
        </div>

        <div class="linha-filtro">
            <label>CPF</label>
            <input v-model="filters.cpf" type="text" placeholder="Buscar por CPF" />
        </div>

        <div class="linha-filtro">
            <label>De</label>
            <input v-model="filters.from" type="date" />
        </div>

        <div class="linha-filtro">
            <label>Até</label>
            <input v-model="filters.to" type="date" />
        </div>

        <div class="acoes-filtro">
            <button class="btn-filtrar" type="button" @click="onSearch">
                Filtrar
            </button>
            <button class="btn-limpar" type="button" @click="onClear">
                Limpar
            </button>
        </div>
    </div>
</template>

<style scoped>
.filtros {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
}

.linha-filtro {
    display: flex;
    flex-direction: column;
    min-width: 160px;
}

.linha-filtro label {
    margin-bottom: 4px;
    font-size: 0.85rem;
}

.linha-filtro input {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #1f4d1a;
    background-color: #020503;
    color: #fff;
}

.acoes-filtro {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.btn-filtrar,
.btn-limpar {
    border: none;
    border-radius: 4px;
    padding: 6px 14px;
    font-size: 0.85rem;
    cursor: pointer;
}

.btn-filtrar {
    background-color: #1f6feb;
    color: #fff;
}

.btn-limpar {
    background-color: #555;
    color: #fff;
}

input[type="date"] {
    color-scheme: white;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>