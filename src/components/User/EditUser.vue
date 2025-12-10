<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../../services/apiRequest'
import { toast } from 'vue3-toastify'

const props = defineProps({
    userId: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['updated', 'cancel'])

const form = ref({
    name: '',
    email: '',
    cpf: '',
    profile_id: '',
    addresses: [],
})

const profiles = ref([])
const addresses = ref([])
const loading = ref(false)
const error = ref(null)

const carregarDados = async () => {
    loading.value = true
    error.value = null

    try {
        const [userRes, profilesRes, addressesRes] = await Promise.all([
            api.get(`/users/${props.userId}`),
            api.get('/profiles'),
            api.get('/addresses'),
        ])

        const user = userRes.data.data
        form.value = {
            name: user.nome,
            email: user.email,
            cpf: user.cpf,
            profile_id: user.perfil?.id || '',
            addresses: user.enderecos.map(a => a.id),
        }

        profiles.value = profilesRes.data.data
        addresses.value = addressesRes.data.data
    } catch (err) {
        console.error('Erro ao carregar dados para edição', err.response?.data || err)
        error.value = 'Erro ao carregar dados para edição'
        toast.error('Erro ao carregar dados para edição')
    } finally {
        loading.value = false
    }
}

onMounted(carregarDados)

watch(
    () => props.userId,
    () => {
        carregarDados()
    }
)

const salvar = async () => {
    try {
        const payload = {
            name: form.value.name,
            email: form.value.email,
            cpf: form.value.cpf,
            profile_id: form.value.profile_id,
            addresses: form.value.addresses,
        }
        console.log('payload update', payload)

        const response = await api.put(`/users/${props.userId}`, payload)
        const user = response.data.data ?? response.data
        toast.success('Usuário atualizado com sucesso')
        emit('updated', user)
    } catch (err) {
        console.error('Erro ao atualizar usuário', err.response?.data || err)
        toast.error('Erro ao atualizar usuário')
    }
}

const cancelar = () => {
    emit('cancel')
}
</script>

<template>
    <div class="form-card">
        <div class="form-header">
            <h1>Editar usuário</h1>
            <button class="btn-voltar" @click="cancelar">Voltar</button>
        </div>

        <div v-if="loading">Carregando dados...</div>
        <div v-else-if="error">{{ error }}</div>
        <template v-else>
            <div class="linha-form">
                <label>Nome</label>
                <input v-model="form.name" type="text" />
            </div>

            <div class="linha-form">
                <label>Email</label>
                <input v-model="form.email" type="email" />
            </div>

            <div class="linha-form">
                <label>CPF</label>
                <input v-model="form.cpf" type="text" />
            </div>

            <div class="linha-form">
                <label>Perfil</label>
                <select v-model="form.profile_id">
                    <option disabled value="">Selecione um perfil</option>
                    <option v-for="profile in profiles" :key="profile.id" :value="profile.id">
                        {{ profile.name }}
                    </option>
                </select>
            </div>

            <div class="linha-form">
                <label>Endereços</label>
                <div class="lista-enderecos">
                    <label v-for="address in addresses" :key="address.id" class="item-endereco">
                        <input type="checkbox" :value="address.id" v-model="form.addresses" />
                        <span>
                            Rua: {{ address.street }} | CEP: {{ address.cep }}
                        </span>
                    </label>
                </div>
            </div>

            <div class="acoes-form">
                <button class="btn-voltar" @click="cancelar">Cancelar</button>
                <button class="btn-salvar" @click="salvar">Salvar</button>
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

.linha-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.linha-form label {
    margin-bottom: 4px;
    font-size: 0.9rem;
}

.linha-form input,
.linha-form select {
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid #1f4d1a;
    background-color: #020503;
    color: #fff;
}

.lista-enderecos {
    max-height: 180px;
    overflow-y: auto;
    border-radius: 4px;
    border: 1px solid #1f4d1a;
    padding: 6px 8px;
}

.item-endereco {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    margin-bottom: 4px;
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

.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
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