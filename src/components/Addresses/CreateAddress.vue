<script setup>
import { ref } from 'vue'
import api from '../../services/apiRequest'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['created', 'cancel'])

const form = ref({
    street: '',
    cep: '',
})

const loading = ref(false)
const error = ref(null)

const salvar = async () => {
    loading.value = true
    error.value = null
    try {
        const { data } = await api.post('/addresses', {
            street: form.value.street,
            cep: form.value.cep,
        })
        const address = data.data || data
        toast.success('Endereço criado com sucesso')
        emit('created', address)
    } catch (err) {
        const res = err.response

        if (res && res.status === 422 && res.data?.errors) {
            // limpa erro geral
            error.value = null

            // percorre todas as mensagens de validação
            Object.values(res.data.errors).forEach(msgs => {
                msgs.forEach(msg => toast.error(msg))
            })
        } else {
            console.error('Erro ao criar endereço', err)
            error.value = 'Erro ao criar endereço'
            toast.error('Erro ao criar endereço')
        }
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
            <h1>Novo endereço</h1>
            <button class="btn-voltar" @click="cancelar">Voltar</button>
        </div>

        <div v-if="loading">Salvando...</div>
        <div v-else-if="error">{{ error }}</div>

        <template v-else>
            <div class="linha-form">
                <label>Rua</label>
                <input v-model="form.street" type="text" />
            </div>

            <div class="linha-form">
                <label>CEP</label>
                <input v-model="form.cep" type="text" />
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
    background-color: #1f6feb;
    color: #fff;
    font-size: 0.9rem;
    cursor: pointer;
}

.btn-salvar:hover {
    background-color: #1653b3;
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