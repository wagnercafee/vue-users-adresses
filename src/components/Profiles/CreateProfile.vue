<script setup>
import { ref } from 'vue'
import api from '../../services/apiRequest'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['created', 'cancel'])

const form = ref({
    name: '',
})

const loading = ref(false)
const error = ref(null)

const salvar = async () => {
    loading.value = true
    error.value = null

    try {
        const { data } = await api.post('/profiles', {
            name: form.value.name,
        })

        const profile = data.data || data
        toast.success('Perfil criado com sucesso')
        emit('created', profile)
    } catch (err) {
        console.error('Erro ao criar perfil', err.response?.data || err)
        error.value = 'Erro ao criar perfil'
        toast.error('Erro ao criar perfil')
    } finally {
        loading.value = false
    }
}

const cancelar = () => {
    emit('cancel')
}
</script>

<template>
    <div class="form-card">
        <div class="form-header">
            <h1>Novo perfil</h1>
            <button class="btn-voltar" @click="cancelar">Voltar</button>
        </div>

        <div v-if="loading">Salvando...</div>
        <div v-else-if="error">{{ error }}</div>

        <template v-else>
            <div class="linha-form">
                <label>Nome</label>
                <input v-model="form.name" type="text" />
            </div>

            <div class="acoes-form">
                <button class="btn-voltar" type="button" @click="cancelar">Cancelar</button>
                <button class="btn-salvar" type="button" @click="salvar">Criar</button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.form-card {
    max-width: 500px;
    margin: 20px auto 0;
    padding: 18px 22px;
    border-radius: 10px;
    border: 1px solid #1f4d1a;
    background-color: #060f05;
}

.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.linha-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.linha-form label {
    margin-bottom: 4px;
    font-size: 0.9rem;
}

.linha-form input {
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid #1f4d1a;
    background-color: #020503;
    color: #fff;
}

.acoes-form {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.btn-salvar {
    border: none;
    border-radius: 4px;
    padding: 6px 14px;
    background-color: #23a539;
    color: #fff;
    font-size: 0.9rem;
    cursor: pointer;
}

.btn-salvar:hover {
    background-color: #10803b;
}

.btn-voltar {
    border: none;
    border-radius: 4px;
    padding: 6px 14px;
    background-color: #555;
    color: #fff;
    font-size: 0.9rem;
    cursor: pointer;
}

.btn-voltar:hover {
    background-color: #666;
}
</style>